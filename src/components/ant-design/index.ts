import {
  Alert,
  AutoComplete,
  Button,
  Badge,
  Breadcrumb,
  Card,
  Checkbox,
  Carousel,
  DatePicker,
  TimePicker,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Pagination,
  Popconfirm,
  Radio,
  Select,
  Spin,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Transfer,
  Tree,
  Upload,
  message,
  Collapse,
  Popover,
  Row,
  Col,
  Descriptions
} from 'ant-design-vue'
import 'ant-design-vue/lib/grid/style/index.css'

export default (Vue) => {
  Vue.use(Alert)
  Vue.use(AutoComplete)
  Vue.use(Button)
  Vue.use(Badge)
  Vue.use(Breadcrumb)
  Vue.use(Card)
  Vue.use(Checkbox)
  Vue.use(Carousel)
  Vue.use(DatePicker)
  Vue.use(TimePicker)
  Vue.use(Divider)
  Vue.use(Drawer)
  Vue.use(Dropdown)
  Vue.use(Empty)
  Vue.use(Form)
  Vue.use(Input)
  Vue.use(Layout)
  Vue.use(Menu)
  Vue.use(Modal)
  Vue.use(Pagination)
  Vue.use(Popconfirm)
  Vue.use(Radio)
  Vue.use(Select)
  Vue.use(Spin)
  Vue.use(Steps)
  Vue.use(Switch)
  Vue.use(Table)
  Vue.use(Tabs)
  Vue.use(Tag)
  Vue.use(Tooltip)
  Vue.use(Transfer)
  Vue.use(Tree)
  Vue.use(Upload)
  Vue.use(Collapse)
  Vue.use(Popover)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Descriptions)
  Vue.config.globalProperties.$message = message
  Vue.config.globalProperties.$confirm = Modal.confirm
  Vue.config.globalProperties.$info = Modal.info
  Vue.config.globalProperties.$success = Modal.success
  Vue.config.globalProperties.$error = Modal.error
  Vue.config.globalProperties.$warning = Modal.warning
}
