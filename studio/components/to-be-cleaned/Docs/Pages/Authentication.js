import Link from 'next/link'
import Snippets from '../Snippets'
import CodeSnippet from '../CodeSnippet'

export default function Authentication({ autoApiService, selectedLang, showApiKey }) {
  // [Joshen] ShowApiKey should really be a boolean, its confusing
  const defaultApiKey =
    showApiKey !== 'SUPABASE_KEY' ? autoApiService.defaultApiKey : 'SUPABASE_CLIENT_API_KEY'
  const serviceApiKey =
    showApiKey !== 'SUPABASE_KEY' ? autoApiService.serviceApiKey : 'SUPABASE_SERVICE_KEY'

  return (
    <>
      <h2 className="doc-heading">认证</h2>
      <div className="doc-section">
        <article className="text ">
          <p>Supabase通过JWT结合Key Auth实现认证</p>
          <p>
            如果您的请求不包含 <code>Authorization</code> 头, 系统则认为这是一个匿名请求。
          </p>
          <p>
            如果请求包含<code>Authorization</code>头, 系统则会接收请求的时候，根据请求头信息判断用户的角色。有关更多详细信息，请参阅用户管理部分。
          </p>
          <p>建议将密钥设置为环境变量。</p>
        </article>
      </div>

      <h2 className="doc-heading">客户端API密钥</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>
            客户端密钥允许对数据库进行“匿名访问”，直到用户登录为止。登录后，密钥将切换到用户自己的登录令牌。
          </p>
          <p>
            在本文档中，我们将使用<code>SUPABASE_KEY</code>变量来引用密钥。
          </p>
          <p>
            我们为您提供了客户端密钥，后续你也可以根据需要添加任意数量的密钥。 你可以在{' '}
            <Link href={`/project/${autoApiService.project.ref}/settings/api`}>
              <a>API设置</a>
            </Link>{' '}页面查看<code>anon</code> 这个密钥的值。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authKey('CLIENT API KEY', 'SUPABASE_KEY', defaultApiKey)}
          />
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authKeyExample(defaultApiKey, autoApiService.endpoint, {
              showBearer: false,
            })}
          />
        </article>
      </div>

      <h2 className="doc-heading">服务密钥</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>
            服务密钥可以访问您的所有数据，绕过任何安全策略，应该尽量避免该密钥泄漏。它们只能在服务器上使用，而不能在客户端或浏览器上使用。
          </p>
          <p>
            在本文档中，我们使用<code>SERVICE_KEY</code>变量名来引用该密钥。
          </p>
          <p>
            我们为您提供了服务密钥，后续你也可以根据需要添加任意数量的密钥。 你可以在{' '}
            <Link href={`/project/${autoApiService.project.ref}/settings/api`}>
              <a>API设置</a>
            </Link>{' '}页面查看<code>service_role</code> 这个密钥的值。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authKey('SERVICE KEY', 'SERVICE_KEY', serviceApiKey)}
          />
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authKeyExample(serviceApiKey, autoApiService.endpoint, {
              keyName: 'SERVICE_KEY',
            })}
          />
        </article>
      </div>
    </>
  )
}
