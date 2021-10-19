

const CART_PRODUCTOS = "cartProductsId";


// funcion que se ejecuta una vez que la página se haya cargado

document.addEventListener("DOMContentLoaded", () => {
     loadProducts();
     loadProductCart();
});



// funcion fetch para traer datos de la base de datos
function getProductsDb() {
    const url = "../dbProducts.json";

    return fetch(url).then(Response => {
        return Response.json();
    }).then(result => {
        return result;
    }).catch(er => {
        console.error(er);
    })
}



// funcion para cargar los productos como si fuece un componente
async function loadProducts() {
    const products = await getProductsDb();
    
    let html = '';

    products.forEach(producto => {
        html += `
            <div class="col-3 product-container">
               <div class="card product">
                   <img src="${producto.image}"
                        class="card-img-top"
                        alt="${producto.name}" 
                   />

                   <div class="card-body">
                       <h5 class="card-title">${producto.name}</h5>
                       <p class="card-text">${producto.extraInfo}</p>
                       <p class="card-text">${producto.price} $ / Unidad</p>
                       <button 
                          type="button" 
                          class="btn btn-primary btn-cart"
                          onClick=(addProductCart(${producto.id}))
                        >Añadir al carrito</button>
                   </div>
               </div>
            </div>
        `;
    });


    document.getElementsByClassName("products")[0].innerHTML = html;


}



// funcion de funcionalidad para el carrito
function openCloseCart() {
    const containerCart = document.getElementsByClassName('cart-products')[0];

    containerCart.classList.forEach(item => {
         if(item === "hidden") {
            containerCart.classList.remove('hidden');
            containerCart.classList.add('active');
         } 
         
         if(item === "active") {
            containerCart.classList.remove('active');
            containerCart.classList.add('hidden');
         }
    });


}



// funcion para guardar los productos en el localStorage
function addProductCart(idProduct) {
    let arrayProductsId = [];

    let localStorageItems = localStorage.getItem(CART_PRODUCTOS);

    // condicion indica que si no tenemos productos, osea null...
    if(localStorageItems === null) {
        arrayProductsId.push(idProduct);
        localStorage.setItem(CART_PRODUCTOS, arrayProductsId);
    } else {
        let productsId = localStorage.getItem(CART_PRODUCTOS);
        if(productsId.length > 0) {
            productsId += "," + idProduct;
        } else {
            productsId = productsId;
        }

        localStorage.setItem(CART_PRODUCTOS, productsId);
    }

    loadProductCart();
}



async function loadProductCart() {
    const products = await getProductsDb();

    // convertir el resultado del localStorage en un array
    const localStorageItems = localStorage.getItem(CART_PRODUCTOS);

    let html = "";

    if(!localStorageItems) {
        html = `
            <div class="cart-product empty">
               <p>Carrito vacio.</p>
            </div>
        `;
    } else {

    const idProductsSplit = localStorageItems.split(',');

    // eliminamos los ids duplicados
    const idProductsCart = Array.from(new Set(idProductsSplit))
    
    idProductsCart.forEach(id => {
        products.forEach(product => {
            if(id == product.id) {

                const quantity = countDuplicatesId(id, idProductsSplit);
                const totalPrice = product.price * quantity; 


                html += `
                   <div class="cart-product">
                     <img src="${product.image}" alt="${product.name}" />

                     <div class="cart-product-info">
                        <span class="quantity">${quantity}</span>
                        <p>${product.name}</p>
                        <p>${totalPrice.toFixed(2)}</p>
                        <p class="change-quantity">
                           <button onClick="decreaseQuantity(${product.id})">-</button>
                           <button onClick="increaseQuantity(${product.id})">+</button>
                        </p>

                        <p class="cart-product-delete">
                           <button onClick=(deleteProductCart(${product.id}))>Eliminar</button>
                        </p>
                     </div>
                   </div>
                `;
            }
        });
    });

   } // fin del else

    document.getElementsByClassName('cart-products')[0].innerHTML = html;
}



// funcion para eliminar productos del carrito
function deleteProductCart(idProduct) {
   const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
   const arrayIdProductsCart = idProductsCart.split(',');
   const resultIdDelete = deleteAllIds(idProduct, arrayIdProductsCart);

   if(resultIdDelete) {
       let count = 0;
       let idsString = "";

       resultIdDelete.forEach(id => {
           count++;
           if(count < resultIdDelete.length){
               idsString += id + ',';
           } else {
               idsString += id;
           }
       });

       localStorage.setItem(CART_PRODUCTOS, idsString);
   }

   const idsLocalStorage = localStorage.getItem(CART_PRODUCTOS);
   if(!idsLocalStorage) {
       localStorage.removeItem(CART_PRODUCTOS);
   }

   // para que recargue carrito una vez que se elimine producto
   loadProductCart();
}


// funcion para incrementar la cantidad de productos en carrito
function increaseQuantity(idProduct) {
    const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
    const arrayIdProductsCart = idProductsCart.split(',');
    arrayIdProductsCart.push(idProduct);

    let count = 0;
    let idsString = "";
    arrayIdProductsCart.forEach(id => {
        count++;
        if(count < arrayIdProductsCart.length) {
            idsString += id + ",";
        } else {
            idsString += id;
        }
    });


    localStorage.setItem(CART_PRODUCTOS, idsString);
    loadProductCart();
}


// funcion para decrementar la cantidad de productos en carrito
function decreaseQuantity(idProduct) {
    const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
    const arrayIdProductsCart = idProductsCart.split(',');

    const deleteItem = idProduct.toString();
    let index = arrayIdProductsCart.indexOf(deleteItem);

    if(index > -1) {
        arrayIdProductsCart.splice(index, 1);
    }

    let count = 0;
    let idsString = "";

    arrayIdProductsCart.forEach(id => {
        count++;

        if(id < arrayIdProductsCart.length) {
            idsString += id + ","; 
        } else {
            idsString += id;
        }
    });


    localStorage.setItem(CART_PRODUCTOS, idsString);
    loadProductCart();
}


// funcion para quitar elementos de un array
function deleteAllIds(id, arrayIds) {
   return arrayIds.filter(itemId => {
       return itemId != id;
   });
}


// funcion para agregas más del mismo producto en un carrito
function countDuplicatesId(value, arrayIds) {
    let count = 0;

    arrayIds.forEach(id => {
        if(value == id) {
            count++;
        }
    });

    return count;
}