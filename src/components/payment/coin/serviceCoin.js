const convertPaymentType = (arr, type) => {
    const result = arr.filter((val, i) => val.name===type)
    return result[0].description;
}
export { convertPaymentType }