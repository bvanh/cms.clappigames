import React from 'react'

const dataListStats = {
    listNameStats: ['DAU', 'MAU', 'NRU', 'DPU', 'NPU', 'PR', 'ARPDAU', 'ARPPDAU']
}
const convertContent = (val) => {
    switch (val) {
        case 'DPU':
            return "Daily paid user"
        case 'NPU':
            return "New pay user"
        case 'PR':
            return "Pay/Rate"
        case 'ARPDAU':
            return "REV/DAU"
        case 'ARPPDAU':
            return "REV/DPU"
        default:
            break;
    }
}
export { dataListStats, convertContent };