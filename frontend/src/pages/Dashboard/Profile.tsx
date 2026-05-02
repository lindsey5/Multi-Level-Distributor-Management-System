import { useSelector } from "react-redux"
import type { RootState } from "../../lib/features/store"
import Card from "../../components/ui/Card";
import { User } from "lucide-react";
import TextField from "../../components/ui/Textfield";
import { useForm, type SubmitHandler } from "react-hook-form";
import { distributorSchema, type DistributorFormData } from "../../schemas/distributorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/ui/Button";
import { useUpdateDistributor } from "../../hooks/distributor/use-update-distributor.hook";
import { promiseToast } from "../../utils/sileo";

export default function Profile () {
    const auth = useSelector((store : RootState) => store.auth);
    const distributor = auth.distributor;

    const updateMutation = useUpdateDistributor();

    const { register, handleSubmit, formState: { errors } } = useForm<DistributorFormData>({
        resolver: zodResolver(distributorSchema),
        defaultValues: distributor || undefined
    });

    const onSubmit : SubmitHandler<DistributorFormData> = async (data) => {
        const isConfirmed = confirm('Are you sure you want to save these changes?');
        if(!isConfirmed) return;

        promiseToast(updateMutation.mutateAsync(data));
    }

    return (
        <Card className="flex-1 space-y-3">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-start gap-3 px-5 py-3 border border-gray-300 rounded-md">
                    <div className="p-3 bg-black rounded-full text-white">
                        <User size={30}/>
                    </div>
                    <div className="space-y-1">
                        <h1 className="font-bold">{distributor?.distributor_name}</h1>
                        <p className="font-semibold text-sm">ID: {distributor?.distributor_id}</p>
                        <p className="text-gray-400 text-sm">{distributor?.email}</p>
                        <p className="text-gray-400 text-sm">Commission Rate: {distributor?.commission_rate}%</p>
                        <p className="text-gray-400 text-sm">Commission from Downline Distributor: {distributor?.child_commission_rate}%</p>
                    </div>
                </div>
                <TextField 
                    label="Name"
                    registration={register("distributor_name")}
                    error={errors.distributor_name?.message}
                />
                <TextField 
                    label="Email"
                    registration={(register("email"))}
                    error={errors.email?.message}
                />

                <div className="mt-4 flex justify-end">
                    <Button className="py-2" type="submit">
                        Save Changes
                    </Button>
                </div>
            </form>
        </Card>
    )
}