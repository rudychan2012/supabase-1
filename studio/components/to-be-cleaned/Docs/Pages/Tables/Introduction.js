import CodeSnippet from '../../CodeSnippet'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Introduction({ autoApiService, selectedLang }) {
  const router = useRouter()
  let ref = router.query.ref
  return (
    <>
      <h2 className="doc-heading">介绍</h2>
      <div className="doc-section">
        <article className="text ">
          <p>
            <code>public schema</code>下的所有视图和表都可用于查询。
          </p>
        </article>
      </div>
      <h2 className="doc-heading">非公开表</h2>
      <div className="doc-section">
        <article className="text ">
          <p>
            如果您不想在API可访问某些表，只需将它们添加到其他schema下接口
            (即：不是<code>public schema</code>)。
          </p>
        </article>
        <article className="code"></article>
      </div>
      <h2 className="doc-heading">
        GraphQL <span className="lowercase">对比</span> Supabase
      </h2>
      <div className="doc-section">
        <article className="text ">
          <p>
            如果您有使用GraphQL的经验，您可能想知道是否可以在一次请求中获取数据。答案是肯定的！
          </p>
          <p>
            语法非常相似。这个例子展示了如何使用Apollo GraphQL和Supabase完成同样的事情。
            <br />
            <br />
          </p>
          <h4>仍然想使用GraphQL?</h4>
          <p>
            如果你仍然想使用 GraphQL，完全可以。Supabase为您提供了一个完整的Postgres数据库，因此只要您的中间件可以连接到该数据库，那么您仍然可以使用您喜欢的工具。
          </p>
        </article>
        <article className="code">
          <CodeSnippet selectedLang={selectedLang} snippet={localSnippets.withApollo()} />
          <CodeSnippet selectedLang={selectedLang} snippet={localSnippets.withSupabase()} />
        </article>
      </div>
    </>
  )
}

const localSnippets = {
  withApollo: () => ({
    title: 'With Apollo GraphQL',
    bash: {
      language: 'js',
      code: `
const { loading, error, data } = useQuery(gql\`
  query GetDogs {
    dogs {
      id
      breed
      owner {
        id
        name
      }
    }
  }
\`)`,
    },
    js: {
      language: 'js',
      code: `
const { loading, error, data } = useQuery(gql\`
  query GetDogs {
    dogs {
      id
      breed
      owner {
        id
        name
      }
    }
  }
\`)`,
    },
  }),
  withSupabase: () => ({
    title: 'With Supabase',
    bash: {
      language: 'js',
      code: `
const { data, error } = await supabase
  .from('dogs')
  .select(\`
      id, breed,
      owner (id, name)
  \`)
`,
    },
    js: {
      language: 'js',
      code: `
const { data, error } = await supabase
  .from('dogs')
  .select(\`
      id, breed,
      owner (id, name)
  \`)
`,
    },
  }),
}
