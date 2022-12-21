import Link from 'next/link'
import Snippets from '../Snippets'
import CodeSnippet from '../CodeSnippet'
import { useRouter } from 'next/router'
import { makeRandomString } from 'lib/helpers'

const randomPassword = makeRandomString(20)

export default function UserManagement({ autoApiService, selectedLang, showApiKey }) {
  const router = useRouter()

  const keyToShow = showApiKey ? showApiKey : 'SUPABASE_KEY'

  return (
    <>
      <h2 className="doc-heading">用户管理</h2>
      <div className="doc-section">
        <article className="text ">
          <p>Supabase提供了极其便利的用户管理功能。</p>
          <p>
            Supabase为每个用户分配唯一的ID。您可以在数据库中的任何位置引用此ID。例如，当你创建<code>profiles</code>用户表时，您可以使用<code>user_id</code>字段引用用户。
          </p>
          <p>
            Supabase同时内置了注册、登录和注销的页面路由，用于管理您的应用程序和网站中的用户。
          </p>
        </article>
      </div>

      <h2 className="doc-heading">注册</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>允许用户注册并创建新帐户。</p>
          <p>
            在用户注册后，所有使用Supabase JS客户端的交互都将以"该用户"的身份执行。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authSignup(autoApiService.endpoint, keyToShow, randomPassword)}
          />
        </article>
      </div>

      <h2 className="doc-heading">邮箱/密码方式登录</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>如果创建了用户，则该用户可以登录到您的应用程序。</p>
          <p>
            登录后，所有使用Supabase JS客户端的交互都将以"该用户"的身份执行。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authLogin(autoApiService.endpoint, keyToShow, randomPassword)}
          />
        </article>
      </div>

      <h2 className="doc-heading">邮件中的魔法链接登录</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>向用户发送可用于获取access_token的无密码链接。</p>
          <p>
            在他们点击链接后，所有使用Supabase JS客户端的交互都将以"该用户"的身份执行。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authMagicLink(autoApiService.endpoint, keyToShow)}
          />
        </article>
      </div>

      <h2 className="doc-heading">手机/密码注册</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>
            可以使用电话号码代替电子邮件作为主要帐户确认机制。
          </p>
          <p>
            用户将通过短信接收验证码，通过验证码验证用户身份。
          </p>
          <p>
            您必须在身份验证设置页面上输入自己的 twilio 凭据才能启用短信确认。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authPhoneSignUp(autoApiService.endpoint, keyToShow, randomPassword)}
          />
        </article>
      </div>

      <h2 className="doc-heading">短信验证码登录</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>
            使用短信验证码，则您需要为用户提供一个界面来验证他们收到的 6 位数字。
          </p>
          <p>
            您必须在身份验证设置页面上输入自己的 twilio 凭据才能启用基于 SMS 的登录。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authMobileOTPLogin(
              autoApiService.endpoint,
              keyToShow,
              randomPassword
            )}
          />
        </article>
      </div>

      <h2 className="doc-heading">短信验证</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>
            用户收到验证码后，让他们在表单中输入该验证码并发送以进行验证。
          </p>
          <p>
            您必须在身份验证设置页面上输入自己的 twilio 凭据才能启用基于 SMS 的 OTP 验证。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authMobileOTPVerify(
              autoApiService.endpoint,
              keyToShow,
              randomPassword
            )}
          />
        </article>
      </div>

      <h2 className="doc-heading">使用第三方OAuth登录</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>
            用户可以使用第三方OAuth登录，如Google，Facebook，GitHub等。您必须先在身份验证提供程序中，设置并启用它们{' '}
            <span className="text-green-500">
              <Link key={'AUTH'} href={`/project/${router.query.ref}/auth/providers`}>
                这里
              </Link>
            </span>{' '}
            。
          </p>
          <p>
            查看所有可用的{' '}
            <a href="https://supabase.com/docs/guides/auth#providers" target="_blank">
              第三方OAuth认证服务
            </a>
          </p>
          <p>
            登录后，所有使用Supabase JS客户端的交互都将以"该用户"的身份执行。
          </p>
          <p>
            生成OAuth认证客户端 ID 和密钥的方式请参考:{` `}
            <a href="https://console.developers.google.com/apis/credentials" target="_blank">
              Google
            </a>
            ,{` `}
            <a href="https://github.com/settings/applications/new" target="_blank">
              GitHub
            </a>
            ,{` `}
            <a href="https://gitlab.com/oauth/applications" target="_blank">
              GitLab
            </a>
            ,{` `}
            <a href="https://developers.facebook.com/apps/" target="_blank">
              Facebook
            </a>
            ,{` `}
            <a
              href="https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/"
              target="_blank"
            >
              Bitbucket
            </a>
            .
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authThirdPartyLogin(autoApiService.endpoint, keyToShow)}
          />
        </article>
      </div>

      <h2 className="doc-heading">用户</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>获取登录用户的 JSON 对象。</p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authUser(autoApiService.endpoint, keyToShow)}
          />
        </article>
      </div>

      <h2 className="doc-heading">发送忘记密码邮件</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>
            通过邮件向用户发送登录链接。登录后，您应该将用户重定向到新的密码设置页面，并使用下面的"更新用户"保存新密码。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authRecover(autoApiService.endpoint, keyToShow)}
          />
        </article>
      </div>

      <h2 className="doc-heading">更新用户</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>
            使用新的电子邮件或密码更新用户，每个密钥（电子邮件、密码和数据）都是可选的。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authUpdate(autoApiService.endpoint, keyToShow)}
          />
        </article>
      </div>

      <h2 className="doc-heading">登出</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>
            调用登出后，所有使用 Supabase JS 客户端的交互都将是"匿名的"。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authLogout(autoApiService.endpoint, keyToShow, randomPassword)}
          />
        </article>
      </div>

      <h2 className="doc-heading">通过邮件向用户发送邀请</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>向用户发送可用于注册和登录的无密码链接。</p>
          <p>
            在他们点击链接后，所有使用Supabase JS客户端的交互都将以"该用户"的身份执行。
          </p>
          <p>
            该接口调用需要使用<code>service_role_key</code> 初始化supabase客户端，且建议从服务端发起调用，而非客户端。
          </p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.authInvite(autoApiService.endpoint, keyToShow)}
          />
        </article>
      </div>
    </>
  )
}
