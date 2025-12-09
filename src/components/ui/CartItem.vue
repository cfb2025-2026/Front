<script setup lang="ts">
import { computed } from 'vue'
import Quantity from './Quantity.vue'
import DeleteIcon from '~/assets/icons/DeleteIcon.vue';
const props = defineProps<{
    item: {
        product_id: string
        product_name: string
        product_price: number
        product_imgurl?: string
        qty: number
        cart_id?: string
    }
}>()

const emit = defineEmits<{
    (e: 'update:qty', payload: { id: string; qty: number }): void
    (e: 'remove', id: string): void
}>()

const subtotal = computed(() => (Number(props.item.product_price || 0) * (props.item.qty || 0)).toFixed(2))

function onQtyChange(v: number) {
    const id = props.item.cart_id || props.item.product_id
    emit('update:qty', { id, qty: v })
}

function onRemove() {
    const id = props.item.cart_id || props.item.product_id
    emit('remove', id)
}
</script>

<template>
    <div class="item-product" :id="item.product_id">
        <img :src="item.product_imgurl || '/logo.svg'" :alt="item.product_name" />
        <div class="product-info">
            <div class="item-product-name">{{ item.product_name }}</div>
            <div class="item-product-cart">{{ Number(item.product_price || 0).toFixed(2) }} €</div>
            <Quantity :modelValue="item.qty" @update:modelValue="onQtyChange" />
        </div>
        <div class="container">
            <!-- <button @click="onRemove">Supprimer</button> -->
            <DeleteIcon @click="onRemove" class="delete-icon" />
            <!-- <div>{{ subtotal }} €</div> -->
        </div>
    </div>
</template>

<style scoped>
.item-product {
    display: grid;
    grid-template-columns: 100px 1fr auto;
    color: var(--text-color);
    gap: 15px;
    img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 10px;
    }

    .product-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
    }

    .item-product-name {
        font-family: var(--font-title);
        font-size: 14px;
    }
    .item-product-cart {
        font-size: 14px;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;

        .delete-icon {
            cursor: pointer;
        }
    }
}
</style>