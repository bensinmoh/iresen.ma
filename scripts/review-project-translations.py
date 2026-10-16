"""Apply terminology corrections to working translations; never marks them approved."""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1] / '.local/projects'
source = json.loads((ROOT / 'source.json').read_text())
translations = json.loads((ROOT / 'translations.json').read_text())
locations = {
    'EMI': ('EMI', 'EMI'),
    'Green Energy Park': ('Green Energy Park', 'Green Energy Park'),
    'MAScIR, Rabat': ('MAScIR, Rabat', 'MAScIR، الرباط'),
    'ENSET Mohammedia, ELEXPERT': ('ENSET Mohammedia, ELEXPERT', 'ENSET المحمدية، ELEXPERT'),
    'MAScIR': ('MAScIR', 'MAScIR'), 'Mascir': ('Mascir', 'Mascir'), 'MASCIR': ('MASCIR', 'MASCIR'),
    'UIT Kenitra': ('UIT Kenitra', 'UIT القنيطرة'),
    'EST Fès': ('EST Fez', 'EST فاس'), 'ENS RABAT': ('ENS Rabat', 'ENS الرباط'),
    'GEP-MCI Côte d’Ivoire': ('GEP-MCI Côte d’Ivoire', 'GEP-MCI كوت ديفوار'),
    'GEP - MCI Côte d’Ivoire': ('GEP - MCI Côte d’Ivoire', 'GEP - MCI كوت ديفوار'),
}
theme_terms = {
    'Solaire thermique': ('Solar thermal energy', 'الطاقة الشمسية الحرارية'),
    'Solaire photovoltaïque': ('Solar photovoltaics', 'الطاقة الشمسية الكهروضوئية'),
    'Solaire Photovoltaïque': ('Solar photovoltaics', 'الطاقة الشمسية الكهروضوئية'),
    'Réseaux intelligents': ('Smart grids', 'الشبكات الذكية'),
    'Réseaux électriques': ('Electricity grids', 'الشبكات الكهربائية'),
    'Efficacité énergétique': ('Energy efficiency', 'كفاءة الطاقة'),
    'Stockage de l’énergie': ('Energy storage', 'تخزين الطاقة'),
    "Stockage de l'énergie": ('Energy storage', 'تخزين الطاقة'),
    "Stockage de l'energi": ('Energy storage', 'تخزين الطاقة'),
    'Habitat durable': ('Sustainable buildings', 'المباني المستدامة'),
    'Habitat Durable': ('Sustainable buildings', 'المباني المستدامة'),
    'Mobilité durable': ('Sustainable mobility', 'التنقل المستدام'),
    'Mobilité Durable': ('Sustainable mobility', 'التنقل المستدام'),
}
titles = {
    'nanocoating-and-testing': ('Improving CSP reflectivity for effective maintenance', 'تحسين انعكاسية مرايا الطاقة الشمسية المركزة من أجل صيانة فعالة'),
    'aquasolar': ('Coupling concentrated solar energy and water desalination in Morocco', 'الربط بين الطاقة الشمسية المركزة وتحلية المياه في المغرب'),
    'veres': ('Electric Vehicle and Solar Electric Charging (VERES)', 'المركبة الكهربائية والشحن الكهربائي بالطاقة الشمسية (VERES)'),
    'ctai': ('Development of smart thermo-acoustic partitions from local ecological materials using an integrated BLM approach', 'تطوير قواطع ذكية للعزل الحراري والصوتي من مواد بيئية محلية باعتماد نهج BLM متكامل'),
}
months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
en_months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
ar_months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
for record in source:
    for index, locale in enumerate(['en', 'ar']):
        copy = translations[record['reference']][locale]
        if record['location'] in locations:
            copy['location'] = locations[record['location']][index]
        if record['theme'] in theme_terms:
            copy['theme'] = theme_terms[record['theme']][index]
        if record['reference'] in titles:
            copy['title'] = titles[record['reference']][index]
        date = (record['startText'] or '').lower()
        for i, month in enumerate(months):
            if date.startswith(month):
                copy['startText'] = (en_months if locale == 'en' else ar_months)[i] + date[len(month):]
        if re.fullmatch(r'\d{2}/\d{2}/\d{4}', date):
            copy['startText'] = record['startText']
        if locale == 'ar':
            replacements = {'المتظاهرين': 'النماذج التجريبية', 'المتظاهرون': 'النماذج التجريبية',
                            'محرك VRFB': 'بطارية VRFB', 'المروحية والعاكس والشاحن': 'مقطع التيار والعاكس والشاحن',
                            'حجم المنشأة الصناعية': 'تحديد أبعاد المنشأة الصناعية',
                            'دراسة وحجم وتصميم': 'دراسة وتحديد أبعاد وتصميم'}
            for key in ['title', 'description', 'summary', 'objectives']:
                def correct(text):
                    for old, new in replacements.items():
                        text = text.replace(old, new)
                    return text
                copy[key] = [correct(v) for v in copy[key]] if isinstance(copy[key], list) else correct(copy[key])
    if record['reference'] == 'vanabat':
        copy = translations['vanabat']['ar']
        copy['objectives'][1] = 'دمج بطارية V-RFB في الشبكة الكهربائية لمبنى مجهز بمنظومة كهروضوئية بقدرة ذروة 100 كيلوواط.'
# Reviewed AI editorial translations override raw machine output reproducibly.
for locale in ['en', 'ar']:
    reviewed = json.loads((ROOT.parents[1] / f'src/data/project-editorial-{locale}.json').read_text())
    for reference, copy in reviewed.items():
        translations[reference][locale].update(copy)
(ROOT / 'translations.json').write_text(json.dumps(translations, ensure_ascii=False, indent=2) + '\n')
print('Terminology and acronym corrections applied; editorial review remains pending.')
