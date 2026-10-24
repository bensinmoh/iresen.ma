import { moneyParts } from '@/lib/money'

/** Keep amount/code order stable inside Arabic sentences as well as Latin text. */
export function MoneyText({ children }: { children: string }) {
  return moneyParts(children).map((part, index) =>
    index % 2 ? (
      <bdi key={index} dir="ltr">
        {part}
      </bdi>
    ) : (
      part
    ),
  )
}
