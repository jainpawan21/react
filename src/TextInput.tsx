import React, {MouseEventHandler} from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import classnames from 'classnames'

import TextInputInnerVisualSlot from './_TextInputInnerVisualSlot'
import {useProvidedRefOrCreate} from './hooks'
import {Merge} from './utils/types'
import TextInputWrapper, {StyledWrapperProps} from './_TextInputWrapper'
import UnstyledTextInput from './_UnstyledTextInput'

export type TextInputNonPassthroughProps = {
  /** @deprecated Use `leadingVisual` or `trailingVisual` prop instead */
  icon?: React.ComponentType<{className?: string}>
  /** Whether the to show a loading indicator in the input */
  loading?: boolean
  /**
   * Which position to render the loading indicator
   * 'auto' (default): at the end of the input, unless a `leadingVisual` is passed. Then, it will render at the beginning
   * 'leading': at the beginning of the input
   * 'trailing': at the end of the input
   **/
  loaderPosition?: 'auto' | 'leading' | 'trailing'
  /**
   * A visual that renders inside the input before the typing area
   */
  leadingVisual?: string | React.ComponentType<{className?: string}>
  /**
   * A visual that renders inside the input after the typing area
   */
  trailingVisual?: string | React.ComponentType<{className?: string}>
} & Pick<
  StyledWrapperProps,
  | 'block'
  | 'contrast'
  | 'disabled'
  | 'monospace'
  | 'sx'
  | 'width'
  | 'maxWidth'
  | 'minWidth'
  | 'variant'
  | 'size'
  | 'validationStatus'
>

export type TextInputProps = Merge<React.ComponentPropsWithoutRef<'input'>, TextInputNonPassthroughProps>

// using forwardRef is important so that other components (ex. SelectMenu) can autofocus the input
const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      icon: IconComponent,
      leadingVisual: LeadingVisual,
      trailingVisual: TrailingVisual,
      block,
      className,
      contrast,
      disabled,
      loading,
      loaderPosition,
      monospace,
      validationStatus,
      sx: sxProp,
      size: sizeProp,
      // start deprecated props
      width: widthProp,
      minWidth: minWidthProp,
      maxWidth: maxWidthProp,
      variant: variantProp,
      // end deprecated props
      ...inputProps
    },
    ref
  ) => {
    const inputRef = useProvidedRefOrCreate(ref as React.RefObject<HTMLInputElement>)
    // this class is necessary to style FilterSearch, plz no touchy!
    const wrapperClasses = classnames(className, 'TextInput-wrapper')
    const showLeadingLoadingIndicator =
      loading && (loaderPosition === 'leading' || Boolean(LeadingVisual && loaderPosition !== 'trailing'))
    const showTrailingLoadingIndicator =
      loading && (loaderPosition === 'trailing' || Boolean(loaderPosition === 'auto' && !LeadingVisual))
    const focusInput: MouseEventHandler = () => {
      inputRef.current?.focus()
    }

    return (
      <TextInputWrapper
        block={block}
        className={wrapperClasses}
        validationStatus={validationStatus}
        contrast={contrast}
        disabled={disabled}
        monospace={monospace}
        sx={sxProp}
        size={sizeProp}
        width={widthProp}
        minWidth={minWidthProp}
        maxWidth={maxWidthProp}
        variant={variantProp}
        hasLeadingVisual={Boolean(LeadingVisual || showLeadingLoadingIndicator)}
        hasTrailingVisual={Boolean(TrailingVisual || showTrailingLoadingIndicator)}
        onClick={focusInput}
        aria-live="polite"
        aria-busy={Boolean(loading)}
      >
        {IconComponent && <IconComponent className="TextInput-icon" />}
        <TextInputInnerVisualSlot
          visualPosition="leading"
          showLoadingIndicator={showLeadingLoadingIndicator}
          hasLoadingIndicator={typeof loading === 'boolean'}
        >
          {typeof LeadingVisual === 'function' ? <LeadingVisual /> : LeadingVisual}
        </TextInputInnerVisualSlot>
        <UnstyledTextInput ref={inputRef} disabled={disabled} {...inputProps} data-component="input" />
        <TextInputInnerVisualSlot
          visualPosition="trailing"
          showLoadingIndicator={showTrailingLoadingIndicator}
          hasLoadingIndicator={typeof loading === 'boolean'}
        >
          {typeof TrailingVisual === 'function' ? <TrailingVisual /> : TrailingVisual}
        </TextInputInnerVisualSlot>
      </TextInputWrapper>
    )
  }
) as PolymorphicForwardRefComponent<'input', TextInputProps>

TextInput.defaultProps = {
  type: 'text',
  loaderPosition: 'auto'
}

TextInput.displayName = 'TextInput'

export default TextInput
