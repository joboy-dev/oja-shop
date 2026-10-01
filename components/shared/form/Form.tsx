import { FormWrapperProps } from '@/lib/interfaces/form';
import Button from '../button/Button';
import { FormProvider } from 'react-hook-form';
import clsx from 'clsx';

function FormWrapper({
  methods,
  onSubmit,
  title,
  description,
  submitLabel = 'Submit',
  submittingLabel = 'Submitting...',
  isSubmitting = false,
  children,
  className = '',
  buttonVariant = 'primary',
  backgroundColor = "transaparent",
  width,
  buttonWidth,
  afterButtonContent,
}: FormWrapperProps) {

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Form submit triggered');
          onSubmit();
        }}
        className={clsx(
          `max-md:w-full p-4 md:p-6 rounded-xl shadow-lg`,
          width ? `w-[${width}%]` : 'w-full',
          `bg-${backgroundColor}`,
          className
        )}
      >
        {title && <h2 className="text-2xl max-md:text-lg text-center font-bold text-foreground mb-4">{title}</h2>}
        {description && <p className="text-md max-md:text-sm text-gray-500 mb-4">{description}</p>}

        <div className="space-y-4 mb-4">{children}</div>

        <Button
          type='submit'
          children={isSubmitting ? submittingLabel : submitLabel}
          isLoading={isSubmitting}
          variant={buttonVariant}
          className={buttonWidth ? `w-[${buttonWidth}%]`: 'w-full'}
        />

        {afterButtonContent}
      </form>
    </FormProvider>
  );
}

export default FormWrapper;
