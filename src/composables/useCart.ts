import { toast } from 'vue3-toastify';

export const useCart = () => {
  const addToCart = (product: any, qty: number = 1) => {
    try {
      const key = 'cart'
      const raw = localStorage.getItem(key) || '[]'
      const cart: any[] = JSON.parse(raw)
      const idx = cart.findIndex(x => x.product_id === product.product_id)
      
      if (idx >= 0) {
        cart[idx].qty = (cart[idx].qty ?? 1) + qty
      } else {
        cart.push({
          product_id: product.product_id,
          product_name: product.product_name,
          product_price: product.product_price,
          product_imgurl: product.product_imgurl,
          qty: qty
        })
      }
      
      localStorage.setItem(key, JSON.stringify(cart))
      
      // Show confirmation toast
      toast.success(`Ajouté au panier : ${product.product_name}`);
      
    } catch (e) {
      console.error(e)
      toast.error("Erreur lors de l'ajout au panier");
    }
  }

  return {
    addToCart
  }
}