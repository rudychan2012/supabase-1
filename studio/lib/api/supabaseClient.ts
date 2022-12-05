import { createClient } from '@supabase/supabase-js'
import { IS_PLATFORM } from '../constants'

let readOnly: any

/*
 * 使用supabase服务来存放用户对于一个应用的访问权限等相关信息
 * 而我们的部署方式是studio和studio完全独立，因此没必要做permission验证
 * 因此，IS_PLATFORM的执行部分我们完全注释掉即可
 */
// if (IS_PLATFORM) {
//   readOnly = createClient(process.env.READ_ONLY_URL ?? '', process.env.READ_ONLY_API_KEY ?? '')
//   const readOnlyErrMessage = Error('This client is for read-only actions. Use readWrite instead.')
//
//   // overwrites function calls
//   // for readOnly
//   readOnly.from('').insert = () => {
//     throw readOnlyErrMessage
//   }
//   readOnly.from('').delete = () => {
//     throw readOnlyErrMessage
//   }
//   readOnly.from('').update = () => {
//     throw readOnlyErrMessage
//   }
//   readOnly.rpc = () => {
//     throw readOnlyErrMessage
//   }
// }

export { readOnly }
