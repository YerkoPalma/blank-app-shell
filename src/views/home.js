import yo from 'yo-yo'
import switchComponent from '../components/switch'

export default (params, store) => yo`
<div>
  <h1>Home</h1>
  ${switchComponent(null, store)}
</div>
`
