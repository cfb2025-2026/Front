import { toast } from 'vue3-toastify';

export const useCart = () => {
  // Récupère le token du localStorage
  const getToken = () => localStorage.getItem('token');
  
  // Récupère l'utilisateur du localStorage
  const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  const isUserConnected = () => !!getToken();

  const addToCart = async (product: any, qty: number = 1) => {
    try {
      if (isUserConnected()) {
        // L'utilisateur est connecté : appel API
        await addToCartViaAPI(product, qty);
      } else {
        // L'utilisateur n'est pas connecté : localStorage
        addToCartLocalStorage(product, qty);
      }
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  const addToCartLocalStorage = (product: any, qty: number = 1) => {
    const key = 'cart';
    const raw = localStorage.getItem(key) || '[]';
    const cart: any[] = JSON.parse(raw);
    const idx = cart.findIndex(x => x.product_id === product.product_id);

    if (idx >= 0) {
      cart[idx].qty = (cart[idx].qty ?? 1) + qty;
    } else {
      cart.push({
        product_id: product.product_id,
        product_name: product.product_name,
        product_price: product.product_price,
        product_imgurl: product.product_imgurl,
        qty: qty
      });
    }

    localStorage.setItem(key, JSON.stringify(cart));
    toast.success(`Ajouté au panier : ${product.product_name}`);
    window.dispatchEvent(new Event('cart-updated')); // <-- AJOUT
  };

  const addToCartViaAPI = async (product: any, qty: number = 1) => {
    const token = getToken();
    const user = getUser();
    const base = import.meta.env.VITE_API_BASE_URL || '';

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    try {
      //Ajout du produit au panier
      console.log("➕ Ajout au panier Product:", product.product_id, "qty:", qty, "user:", user); // <-- Vérifier
        const createRes = await fetch(`${base}carts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ users_id: user, product_id: product.product_id, product_quantity: qty })
        });

        if (!createRes.ok) throw new Error('Erreur lors de la création du panier');
        const newCart = await createRes.json();
        toast.success(`Ajouté au panier : ${product.product_name}`);
        window.dispatchEvent(new Event('cart-updated')); // <-- AJOUT

    } catch (error) {
      console.error('Erreur API cart:', error);
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  // Modifie la signature pour accepter le cartId
  const removeFromCart = async (cartId: string) => {
    try {
      if (isUserConnected()) {
        await removeFromCartAPI(cartId);
      } else {
        removeFromCartLocalStorage(cartId);
      }
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la suppression du panier");
    }
  };

  // Pour le localStorage, cartId = product_id (on ne change rien ici)
  const removeFromCartLocalStorage = (cartId: string) => {
    const key = 'cart';
    const raw = localStorage.getItem(key) || '[]';
    let cart: any[] = JSON.parse(raw);
    cart = cart.filter(item => item.product_id !== cartId);
    localStorage.setItem(key, JSON.stringify(cart));
    toast.success("Produit retiré du panier");
  };

  // Pour l'API, utilise cartId
  const removeFromCartAPI = async (cartId: string) => {
    const token = getToken();
    const base = import.meta.env.VITE_API_BASE_URL || '';
    if (!token) throw new Error('Utilisateur non trouvé');

    const res = await fetch(`${base}carts/${cartId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    if (!res.ok) {
      console.error("❌ Erreur DELETE:", await res.text());
      throw new Error('Erreur suppression panier');
    }
    toast.success("Produit retiré du panier");
  };

  const updateCartQty = async (cartId: string, qty: number, productId?: string) => {
    if (qty < 1) {
      await removeFromCart(cartId);
      return;
    }
    if (isUserConnected()) {
      if (!productId) throw new Error('product_id manquant');
      await updateCartQtyAPI(cartId, qty, productId);
    } else {
      updateCartQtyLocalStorage(cartId, qty);
    }
    window.dispatchEvent(new Event('cart-updated'));
  };

  const updateCartQtyLocalStorage = (productId: string, qty: number) => {
    const key = 'cart';
    const raw = localStorage.getItem(key) || '[]';
    let cart: any[] = JSON.parse(raw);
    const idx = cart.findIndex(item => item.product_id === productId);
    if (idx >= 0) {
      if (qty < 1) {
        cart.splice(idx, 1);
      } else {
        cart[idx].qty = qty;
      }
      localStorage.setItem(key, JSON.stringify(cart));
    }
  };

  // Modifie la signature pour accepter productId
  const updateCartQtyAPI = async (cartId: string, qty: number, productId: string) => {
    console.log("🔄 Mise à jour quantité CartID:", cartId, "qty:", qty, "productID:", productId); // <-- Vérifier
    const token = getToken();
    const base = import.meta.env.VITE_API_BASE_URL || '';
    if (!token) throw new Error('Utilisateur non trouvé');

    const res = await fetch(`${base}carts/${cartId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_quantity: qty, product_id: productId }) // Ajoute product_id ici
    });
    if (!res.ok) {
      console.error("❌ Erreur PUT:", await res.text());
      throw new Error('Erreur modification quantité');
    }
    toast.success("Quantité mise à jour");
  };

  const getCartCount = async (): Promise<number> => {
    if (isUserConnected()) {
      // API : nombre d'items différents dans le panier
      const token = getToken();
      const user = getUser();
      const base = import.meta.env.VITE_API_BASE_URL || '';
      if (!user) return 0;
      const res = await fetch(`${base}carts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) return 0;
      const carts = await res.json();
      return carts.length; // <-- nombre d'items différents
    } else {
      // LocalStorage : nombre d'items différents
      const raw = localStorage.getItem('cart') || '[]';
      const cart: any[] = JSON.parse(raw);
      return cart.length; // <-- nombre d'items différents
    }
  };

  const syncLocalCartToUser = async () => {
    if (!isUserConnected()) return;
    const raw = localStorage.getItem('cart') || '[]';
    const cart: any[] = JSON.parse(raw);
    for (const item of cart) {
      await addToCartViaAPI(item, item.qty ?? 1);
    }
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cart-updated'));
  };

  return {
    addToCart,
    isUserConnected,
    getUser,
    removeFromCart,
    updateCartQty,
    getCartCount,
    syncLocalCartToUser // <-- Ajoute ici
  };
};