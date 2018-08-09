///////////////////////////////////////////////////////////////////////////////
// Fake data and services
///////////////////////////////////////////////////////////////////////////////

const fakeData = {
  users: [
    {
      id: 1,
      fullname: 'Joe Shmoe',
      address: 'Fake Address 123',
      cart: [
        { item_id: 1, qty: 1 },
        { item_id: 2, qty: 2 },
      ],
    }
  ],
  items: [
    { id: 1, name: 'item_1', price: 20 },
    { id: 2, name: 'item_2', price: 15 },
  ],
}

const UserService = {
  getUserData: userId => Promise.resolve(
    fakeData.users.find(user => user.id === userId)
  )
}

const ItemService = {
  getItemsFromCart(shoppingCart) {
    const items = shoppingCart.reduce((foundItems, cartItem) => {
      const item = fakeData.items.find(item => item.id === cartItem.item_id)
      if (item) {
        foundItems.push(item)
      }
      return foundItems
    }, [])
    return Promise.resolve(items)
  }
}

const OrderService = {
  createOrder(userData, items) {
    console.log(
      `Mr. ${userData.fullname} placed an order for ${items.length} items.`
    )
    return Promise.resolve()
  }
}

///////////////////////////////////////////////////////////////////////////////
// The ugly, Promise based solution:
///////////////////////////////////////////////////////////////////////////////

/**
 * 1. Get user data by user's ID
 * 2. Get items by their IDs
 * 3. Create order
 */

function createOrder(userId) {
  let userData

  // You have to come up with different names for the variable outside the promise chain and the variable inside it in order not to cause conflicts
  // It's just ugly. At first glance the async/await example is more readable and fits better in your mind

  return UserService.getUserData(userId)
    .then(fullUserData => {
      userData = fullUserData
      return ItemService.getItemsFromCart(userData.cart)
    })
    .then(cartItems => OrderService.createOrder(userData, cartItems))
    .catch(console.error)
}

createOrder(1)

///////////////////////////////////////////////////////////////////////////////
// A better solution, using async/await:
///////////////////////////////////////////////////////////////////////////////

// We make the data more robust by using const instead of let
// The overhead of try/catch

async function createOrderAsyncAwait(userId) {
  try {
    const userData  = await UserService.getUserData(userId)
    const cartItems = await ItemService.getItemsFromCart(userData.cart)
    await OrderService.createOrder(userData, cartItems)
  } catch (e) {
    console.error(e)
  }
}

createOrderAsyncAwait(1)

