import { observer } from 'mobx-react-lite'
import { useStore } from 'hooks'
import { PROVIDERS_SCHEMAS } from 'stores/authConfig/schema'
import { FormHeader } from 'components/ui/Forms'
import { HorizontalShimmerWithIcon } from 'components/ui/Shimmers'
import ProviderForm from './ProviderForm'
import { ProviderCollapsibleClasses } from './AuthProvidersForm.constants'

const AuthProvidersForm = () => {
  const { authConfig } = useStore()
  const providers = PROVIDERS_SCHEMAS

  return (
    <div>
      <FormHeader
        title="认证服务商"
        description="通过一套providers和登录方法对用户进行身份验证"
      />

      <div className="-space-y-px">
        {!authConfig.isLoaded
          ? providers.map((provider) => (
              <div
                key={`provider_${provider.title}`}
                className={[...ProviderCollapsibleClasses, 'px-6 py-3'].join(' ')}
              >
                <HorizontalShimmerWithIcon />
              </div>
            ))
          : providers.map((provider) => {
              // @ts-expect-error: Fix type to be dynamic
              return <ProviderForm key={`provider_${provider.title}`} provider={provider} />
            })}
      </div>
    </div>
  )
}

export default observer(AuthProvidersForm)
