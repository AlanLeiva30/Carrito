const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector(
	'.container-cart-products'
);

btnCart.addEventListener('click', () => {
	containerCartProducts.classList.toggle('hidden-cart');
});

const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');
const productsList = document.querySelector('.container-items');
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');
const btnPay = document.getElementById('btn-pay');

// Añadir productos al carrito
productsList.addEventListener('click', e => {
	if (e.target.classList.contains('btn-add-cart')) {
		const product = e.target.parentElement;

		const infoProduct = {
			quantity: 1,
			title: product.querySelector('h2').textContent,
			price: product.querySelector('p').textContent,
		};

		const exists = allProducts.some(
			product => product.title === infoProduct.title
		);

		if (exists) {
			allProducts = allProducts.map(product => {
				if (product.title === infoProduct.title) {
					product.quantity++;
				}
				return product;
			});
		} else {
			allProducts = [...allProducts, infoProduct];
		}

		showHTML();
	}
});

// Eliminar productos del carrito
rowProduct.addEventListener('click', e => {
	if (e.target.classList.contains('icon-close')) {
		const product = e.target.parentElement;
		const title = product.querySelector('.titulo-producto-carrito')
			.textContent;

		allProducts = allProducts.filter(
			product => product.title !== title
		);

		showHTML();
	}
});

// Mostrar carrito y total
const showHTML = () => {
	if (!allProducts.length) {
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
		btnPay.classList.add('hidden');
	} else {
		cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
		btnPay.classList.remove('hidden');
	}

	rowProduct.innerHTML = '';

	let total = 0;
	let totalOfProducts = 0;

	allProducts.forEach(product => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('cart-product');

		containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

		rowProduct.append(containerProduct);

		total += parseInt(product.quantity * product.price.slice(1));
		totalOfProducts += product.quantity;
	});

	valorTotal.innerText = `$${total}`;
	countProducts.innerText = totalOfProducts;
};

// Generar PDF al pagar
const generatePDF = () => {
	const { jsPDF } = window.jspdf;
	const doc = new jsPDF();

	doc.setFontSize(16);
	doc.text('Factura de Compra', 10, 10);

	let y = 20;

	allProducts.forEach(product => {
		doc.setFontSize(12);
		doc.text(
			`${product.quantity} x ${product.title} - ${product.price}`,
			10,
			y
		);
		y += 10;
	});

	doc.setFontSize(14);
	doc.text(`Total a pagar: ${valorTotal.innerText}`, 10, y + 10);

	doc.save('factura-compra.pdf');
};

// Evento para el botón de pagar
btnPay.addEventListener('click', () => {
	if (allProducts.length > 0) {
		alert('¡Gracias por tu compra! Generando factura...');
		generatePDF();

		// Vaciar el carrito después de pagar
		allProducts = [];
		showHTML();
	}
});
