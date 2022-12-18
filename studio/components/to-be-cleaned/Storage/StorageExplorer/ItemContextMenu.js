import { Menu, Item } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.css'

const ItemContextMenu = ({
  id = '',
  onCopyFileURL = () => {},
  onSelectItemRename = () => {},
  onSelectItemMove = () => {},
  onDownloadFile = () => {},
  onSelectItemDelete = () => {},
}) => {
  return (
    <Menu id={id} animation="fade" className="!bg-scale-300 border border-scale-500">
      <Item
        onClick={({ props }) => (!props.item.isCorrupted ? onCopyFileURL(props.item) : () => {})}
      >
        <span className="text-xs">复制URL</span>
      </Item>
      <Item
        onClick={({ props }) =>
          !props.item.isCorrupted ? onSelectItemRename(props.item) : () => {}
        }
      >
        <span className="text-xs">重命名</span>
      </Item>
      <Item
        onClick={({ props }) => (!props.item.isCorrupted ? onSelectItemMove(props.item) : () => {})}
      >
        <span className="text-xs">移动</span>
      </Item>
      <Item
        onClick={({ props }) => (!props.item.isCorrupted ? onDownloadFile(props.item) : () => {})}
      >
        <span className="text-xs">下载</span>
      </Item>
      <Item onClick={({ props }) => onSelectItemDelete(props.item)}>
        <span className="text-xs">删除</span>
      </Item>
    </Menu>
  )
}

export default ItemContextMenu
