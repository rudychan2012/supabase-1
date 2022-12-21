import Snippets from '../Snippets'
import CodeSnippet from '../CodeSnippet'

export default function Introduction({ autoApiService, selectedLang }) {
  return (
    <>
      <h2 className="doc-heading">介绍</h2>
      <div className="doc-section">
        <article className="text ">
          <p>
            此API提供了一种与Postgres数据库集成的简单方法。以下API文档是以您的数据库表生成的。
          </p>
          <p>
            这是基于您的数据库<b>自动生成</b>的API，因此当您对数据库进行更改时，本文档也会更改。
          </p>
          <p>
            <b>请注意:</b> 如果您对字段（列）名称或类型进行更改，则这些字段的API接口将相应更改。因此，请确保在从图形界面更改数据库的时候时，及时地更新API实现与调用。
          </p>
        </article>
      </div>

      <h2 className="doc-heading">API URL</h2>
      <div className="doc-section ">
        <article className="text ">
          <p>应用的 API URL</p>
        </article>
        <article className="code">
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.endpoint(autoApiService.endpoint)}
          />
        </article>
      </div>

      <h2 className="doc-heading">客户端库</h2>
      <div className="doc-section">
        <article className="text ">
          <p>您的API由RESTful接口和实时接口组成</p>
          <p>
            为了与实时数据流交互，我们提供了处理websocket的客户端库。
          </p>
        </article>
        <article className="code">
          <CodeSnippet selectedLang={selectedLang} snippet={Snippets.install()} />
          <CodeSnippet
            selectedLang={selectedLang}
            snippet={Snippets.init(autoApiService.endpoint)}
          />
        </article>
      </div>
    </>
  )
}
