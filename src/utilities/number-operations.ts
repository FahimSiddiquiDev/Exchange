
const config = {
  EN_US: 'en-us'
}
const formatNumber = (num: number) => {
    return new Intl.NumberFormat(config.EN_US, { minimumFractionDigits: 0}).format(num);
  }

export const formatQuantity = (quantity: number) => {
  return formatNumber(quantity).toString().padStart(9, ' ')
  }

export const formatPrice = (price: number) => {
    return formatNumber(price).toString().padStart(6, ' ')
  }
