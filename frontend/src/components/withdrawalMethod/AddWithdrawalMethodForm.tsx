import Button from "../../components/ui/Button";
import Dropdown from "../../components/ui/Dropdown";
import TextField from "../../components/ui/Textfield";
import Card from "../../components/ui/Card";
import { useForm, type SubmitHandler } from "react-hook-form";
import { withdrawalMethodSchema, type WithdrawalMethodFormData } from "../../schemas/distributorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

interface AddWithdrawalMethodFormProps { 
    handleAddMethod: (data : WithdrawalMethodFormData) => Promise<void>, 
    close: () => void, 
    disabled: boolean 
}

export default function AddWithdrawalMethodForm ({ handleAddMethod, close, disabled } :AddWithdrawalMethodFormProps ) {
    const [bankName, setBankName] = useState('');
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<WithdrawalMethodFormData>({
        resolver: zodResolver(withdrawalMethodSchema),
        defaultValues: {
            type: 'bank',
            bank_name: '',
            is_default: false,
        },
    });
    
    const onSubmit : SubmitHandler<WithdrawalMethodFormData> = (data) => handleAddMethod(data);

    return (
        <Card>
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <h3 className="font-bold te">Add Withdrawal Method</h3>

                <div className="space-y-5">
                    <Dropdown 
                        label="Withdrawal Method"
                        value={watch('type')}
                        options={['Bank', 'GCash', 'Maya'].map(option => ({ label: option, value: option.toLowerCase() }))}
                        error={errors.type?.message}
                        onChange={(value : any) => setValue("type", value)}
                    />

                    <TextField 
                        label="Account Name"
                        placeholder="Enter your account name"
                        value={watch('account_name')}
                        error={errors.account_name?.message}
                        registration={register('account_name')}
                    />

                    <TextField 
                        label="Account number"
                        placeholder="Enter your account number"
                        value={watch('account_number')}
                        error={errors.account_number?.message}
                        registration={register('account_number')}
                        type="number"
                    />

                    {watch('type') === 'bank' && (
                        <Dropdown 
                            label="Bank Name"
                            value={bankName === 'Other' ? bankName : watch('bank_name')}
                            options={["Select Bank", "BDO", "BPI", "Metrobank", "Landbank", "PNB", "Security Bank", "UnionBank", "RCBC", "Other"]
                                .map(option => ({ 
                                    label: option, 
                                    value: option === 'Select Bank' ? '' : option,
                                    disabled: option === 'Select Bank'
                                }))}
                            error={bankName !== 'Other' ? errors.bank_name?.message : ''}
                            onChange={(value : any) => {
                                setBankName(value)
                                setValue('bank_name', value === 'Other' ? '' : value)
                            }}
                        />
                    )}
                    {bankName === 'Other' && watch('type') === 'bank' && (
                        <TextField 
                            label="Enter Bank Name"
                            placeholder="Enter your bank name"
                            value={watch('bank_name')}
                            error={errors.bank_name?.message}
                            registration={register('bank_name')}
                        />
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Button 
                        type="button" 
                        className="py-2 bg-gray-100 text-black border-gray-400 shadow-none"
                        onClick={close}
                        disabled={disabled}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        className="px-8 py-2" 
                        disabled={disabled}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Card>
    )
}