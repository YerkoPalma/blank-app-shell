import yo from 'yo-yo'
import switchComponent from '../components/switch'
import { subscribeForPushNotifications } from '../utils'

export default (params, store) => {
  const togglePushSubscription = () => {
    if (!store.getState().isPushEnabled) {
      subscribeForPushNotifications(store)
    }
  }
  return yo`
  <div>
    <h1>Home</h1>
    ${switchComponent(togglePushSubscription)}
  </div>
  `
}
