import moment, {Moment} from "moment";

export const rules = {
    required: (message: string = "Field is required") => ({
        required: true,
        message
    }),
    isDateAfter: (message: string = 'Incorrect date') => () => ({
        validator(_: any, value: Moment) {
            if (value.isSameOrAfter(moment())) {
                return Promise.resolve()
            }
            return Promise.reject(new Error(message))
        }
    })
}
