export interface PrepPayload {
  ingredients: Array<{ name: string; qty: string; unit: string; atRisk: boolean }>
  notes: string
}

declare const PrepPage: (props: { onSubmit: (data: PrepPayload) => void }) => JSX.Element
export default PrepPage
