export class ConvertNumerics {
    //Convert the value to american number format ---> Ex:12.20 (number)
    convertToAmericanValue(value: string): number {
        let valueRep = value.replace(",", ".")
        let totalValue: number = +valueRep

        return totalValue
    }

    //Convert the value to brazillian number format  ---> Ex: "45,12" (string)
    convertToBrazilValue(value: string) {
        return value.replace(".", ",")
    }
}
