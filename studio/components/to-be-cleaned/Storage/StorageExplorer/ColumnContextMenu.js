import { Menu, Item, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.css'

import { STORAGE_VIEWS, STORAGE_SORT_BY, STORAGE_SORT_BY_ORDER } from '../Storage.constants'

const ColumnContextMenu = ({
  id = '',
  onCreateNewFolder = () => {},
  onSelectAllItems = () => {},
  onSelectView = () => {},
  onSelectSort = () => {},
  onSelectSortByOrder = () => {},
}) => {
  return (
    <Menu id={id} animation="fade">
      <Item
        onClick={({ props }) => {
          onCreateNewFolder(props.index)
        }}
      >
        新建文件夹
      </Item>
      <Separator />
      <Item
        onClick={({ props }) => {
          onSelectAllItems(props.index)
        }}
      >
        全选
      </Item>
      <Submenu label="View">
        <Item onClick={() => onSelectView(STORAGE_VIEWS.COLUMNS)}>以列</Item>
        <Item onClick={() => onSelectView(STORAGE_VIEWS.LIST)}>以行</Item>
      </Submenu>
      <Submenu label="Sort by">
        <Item onClick={() => onSelectSort(STORAGE_SORT_BY.NAME)}>名称</Item>
        <Item onClick={() => onSelectSort(STORAGE_SORT_BY.CREATED_AT)}>最近创建</Item>
        <Item onClick={() => onSelectSort(STORAGE_SORT_BY.UPDATED_AT)}>最近修改</Item>
        <Item onClick={() => onSelectSort(STORAGE_SORT_BY.LAST_ACCESSED_AT)}>最近访问</Item>
      </Submenu>
      <Submenu label="Sort by order">
        <Item onClick={() => onSelectSortByOrder(STORAGE_SORT_BY_ORDER.ASC)}>升序</Item>
        <Item onClick={() => onSelectSortByOrder(STORAGE_SORT_BY_ORDER.DESC)}>降序</Item>
      </Submenu>
    </Menu>
  )
}

export default ColumnContextMenu
