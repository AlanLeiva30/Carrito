const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const container_items = document.querySelector('.container-items');

//llama al archivo data.json y renderiza los productos en el DOM
fetch('data.json')
	.then(response => response.json())
	.then(data => {
		console.log(data);
		data.forEach(product => {
			const item = document.createElement('div');
			item.classList.add('item');

			item.innerHTML = `
				<figure>
					<img src="${product.image}" alt="${product.name}" />
				</figure>
				<div class="info-product">
					<h2>${product.name}</h2>
					<p class="price">$${product.price}</p>
					<p class="quantity">Cantidad disponible: <span class="available-quantity">${product.quantity}</span></p>
					<button class="btn-add-cart">Añadir al carrito</button>
				</div>
			`;

			container_items.appendChild(item);
		});
	});

btnCart.addEventListener('click', () => {
	containerCartProducts.classList.toggle('hidden-cart');
});

const rowProduct = document.querySelector('.row-product');
const productsList = document.querySelector('.container-items');
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');
const btnPay = document.getElementById('btn-pay');
const btnEmptyCart = document.getElementById('btn-empty-cart');

// Añadir productos al carrito
productsList.addEventListener('click', e => {
	if (e.target.classList.contains('btn-add-cart')) {
		const product = e.target.parentElement;
		const availableQuantityElement = product.querySelector('.available-quantity');
		const availableQuantity = parseInt(availableQuantityElement.textContent);

		if (availableQuantity > 0) {
			const infoProduct = {
				id: allProducts.length + 1,
				quantity: 1,
				title: product.querySelector('h2').textContent,
				price: product.querySelector('p.price').textContent,
				availableQuantity: availableQuantity - 1
			};

			const exists = allProducts.some(
				product => product.title === infoProduct.title
			);

			if (exists) {
				allProducts = allProducts.map(product => {
					if (product.title === infoProduct.title && product.availableQuantity > 0) {
						product.quantity++;
						product.availableQuantity--;
					}
					return product;
				});
			} else {
				allProducts = [...allProducts, infoProduct];
			}

			availableQuantityElement.textContent = availableQuantity - 1;
			showHTML();
		} else {
			swal("Cantidad insuficiente", "No hay suficientes productos disponibles.", "error");
		}
	}
	console.log(allProducts);
});

//Eliminar un producto del carrito
function eliminarItem(itemId) {
	swal({
		title: "¿Estás seguro?",
		text: "Esto eliminará el producto del carrito.",
		icon: "warning",
		buttons: ["Cancelar", "Eliminar"],
		dangerMode: true,
	}).then((willDelete) => {
		if (willDelete) {
			const productToRemove = allProducts.find(product => product.id === itemId);
			const productElement = [...document.querySelectorAll('.item')].find(item => item.querySelector('h2').textContent === productToRemove.title);
			const availableQuantityElement = productElement.querySelector('.available-quantity');
			availableQuantityElement.textContent = parseInt(availableQuantityElement.textContent) + productToRemove.quantity;

			allProducts = allProducts.filter(product => product.id !== itemId);
			showHTML();
			swal("Producto eliminado", "El producto ha sido eliminado del carrito.", "success");
		}
	});
}

// Vaciar carrito
btnEmptyCart.addEventListener('click', () => {
	if (allProducts.length > 0) {
		swal({
			title: "¿Estás seguro?",
			text: "Esto eliminará todos los productos del carrito.",
			icon: "warning",
			buttons: ["Cancelar", "Vaciar carrito"],
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				allProducts.forEach(product => {
					const productElement = [...document.querySelectorAll('.item')].find(item => item.querySelector('h2').textContent === product.title);
					const availableQuantityElement = productElement.querySelector('.available-quantity');
					availableQuantityElement.textContent = parseInt(availableQuantityElement.textContent) + product.quantity;
				});
				allProducts = [];
				showHTML();
				swal("Carrito vaciado", "Todos los productos han sido eliminados.", "success");
			}
		});
	} else {
		swal("El carrito está vacío", "No hay productos para eliminar.", "info");
	}
});

// Aumentar cantidad de productos
function increaseQuantity(itemId) {
	let productFound = false;
	allProducts = allProducts.map(product => {
		if (product.id === itemId) {
			productFound = true;
			if (product.availableQuantity > 0) {
				product.quantity++;
				product.availableQuantity--;
				const productElement = [...document.querySelectorAll('.item')].find(item => item.querySelector('h2').textContent === product.title);
				const availableQuantityElement = productElement.querySelector('.available-quantity');
				availableQuantityElement.textContent = parseInt(availableQuantityElement.textContent) - 1;
			} else {
				swal("Cantidad insuficiente", "No hay más productos disponibles para agregar.", "error");
			}
		}
		return product;
	});

	if (productFound) {
		showHTML();
	}
}

// Disminuir cantidad de productos
function decreaseQuantity(itemId) {
	allProducts = allProducts.map(product => {
		if (product.id === itemId && product.quantity > 1) {
			product.quantity--;
			product.availableQuantity++;
			const productElement = [...document.querySelectorAll('.item')].find(item => item.querySelector('h2').textContent === product.title);
			const availableQuantityElement = productElement.querySelector('.available-quantity');
			availableQuantityElement.textContent = parseInt(availableQuantityElement.textContent) + 1;
		}
		return product;
	});

	showHTML();
}

// Mostrar el carrito actualizado
const showHTML = () => {
	if (!allProducts.length) {
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
		btnPay.classList.add('hidden');
		btnEmptyCart.classList.add('hidden');
	} else {
		cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
		btnPay.classList.remove('hidden');
		btnEmptyCart.classList.remove('hidden');
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
			<div class="quantity-controls"></div>
				<button class="btn-decrease" onclick="decreaseQuantity(${product.id})">-</button>
				<span class="product-quantity">${product.quantity}</span>
				<button class="btn-increase" onclick="increaseQuantity(${product.id})">+</button>
			</div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="icon-close"
				onclick="eliminarItem(${product.id})"
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

// Función para pagar y generar PDF
btnPay.addEventListener('click', () => {
	if (allProducts.length > 0) {
		swal("¡Pago realizado!", "Generando factura en PDF...", "success").then(() => {
			generatePDF();
			allProducts = [];
			showHTML();
		});
	} else {
		swal("El carrito está vacío", "No hay productos para pagar.", "info");
	}
});

// Generar PDF
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
