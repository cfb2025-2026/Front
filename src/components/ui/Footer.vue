<template>
    <footer class="footer">
        <img src="/logo.svg" alt="Markety" class="footer-logo" @click="scrollToTop" />
        <div class="footer-links">
            <strong>Explorer</strong>
            <ul>
                <li><NuxtLink to="/mobilier">Mobilier</NuxtLink></li>
                <li><NuxtLink to="/decoration">Décoration</NuxtLink></li>
                <li><NuxtLink to="/bijoux">Bijoux</NuxtLink></li>
                <li><NuxtLink to="/vaisselle">Vaisselle</NuxtLink></li>
                <li><NuxtLink to="/linge-de-maison">Linge de Maison</NuxtLink></li>
            </ul>
        </div>
        <div class="footer-contact">
            <strong>Contact</strong>
            <ul>
                <li>06 12 34 56 78</li>
                <li>contact@markety.com</li>
                <li>123 Rue de l'Exemple, <br />
                    Bâtiment A, <br />
                    75001 Paris
                </li>
            </ul>
        </div>
        <span class="footer-copy">
            Copyright © 2025 Markety. Tous droits réservés.
        </span>
    </footer>
</template>

<script setup>
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
</script>

<style scoped>
.footer {
    width: 100%;
    border-top: 2px solid var(--main-color);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto 80px;
    color: var(--text-color);
    font-size: 14px;
    padding-top: 40px;

    .footer-logo {
        grid-area: 1 / 1 / 2 / 2;
        width: 80%;
        max-width: 250px;
        cursor: pointer;
    }

    .footer-links {
        grid-area: 1 / 2 / 2 / 3;
    }

    .footer-contact {
        grid-area: 1 / 3 / 2 / 4;
    }

    .footer-logo,
    .footer-links,
    .footer-contact {
        align-self: center;
        justify-self: center;
    }

    .footer-contact,
    .footer-links {
        align-self: center;
        justify-self: center;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    strong {
        text-transform: uppercase;
        font-size: 16px;
    }

    .footer-copy {
        grid-area: 2 / 1 / 3 / 4;
        text-align: center;
        align-self: center;
    }

    /* Tablettes */
    @media (max-width: 768px) {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto auto;
        padding: 30px 20px;
        gap: 30px;

        .footer-logo {
            grid-area: 1 / 1 / 2 / 3;
            max-width: 200px;
        }

        .footer-links {
            grid-area: 2 / 1 / 3 / 2;
        }

        .footer-contact {
            grid-area: 2 / 2 / 3 / 3;
        }

        .footer-copy {
            grid-area: 3 / 1 / 4 / 3;
        }
    }

    /* Mobiles */
    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        padding: 20px;
        gap: 25px;

        .footer-logo {
            grid-area: auto;
            max-width: 180px;
        }

        .footer-links {
            grid-area: auto;
        }

        .footer-contact {
            grid-area: auto;
        }

        .footer-copy {
            grid-area: auto;
            font-size: 12px;
            padding-top: 10px;
        }
    }
}
</style>