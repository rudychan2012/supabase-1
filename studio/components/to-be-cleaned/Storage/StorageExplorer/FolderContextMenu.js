import { Menu, Item } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.css'

const FolderContextMenu = ({ id = '', onRenameFolder = () => {}, onDeleteFolder = () => {} }) => {
  return (
    <Menu id={id} animation="fade">
      <Item onClick={({ props }) => onRenameFolder(props.item)}>重命名</Item>
      <Item onClick={({ props }) => onDeleteFolder(props.item)}>删除</Item>
    </Menu>
  )
}

export default FolderContextMenu
