"use client";
import React from 'react'
import { useState } from 'react';
import { ClipLoader } from 'react-spinners'

import { countries } from '@/datasetAddress/country'
import { luzonProvinces } from '@/datasetAddress/province'
import { luzonPlaces } from '@/datasetAddress/citiesAndMunicipality'
import { barangaysJaen } from '@/datasetAddress/barangay'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
interface UserAddress {
    id: number;
    email: string;
    rname: string;
    country: string;
    cityMunicipality: string;
    barangay: string;
    province: string;
    description: string;

}
interface Props {
    address?: UserAddress;
    email?: string | null | undefined
}
const AddressCard = ({ address, email }: Props) => {
    const [loading, setLoading] = useState(false)
    const [rName, setRName] = useState<string>(address?.rname ?? '');
    const [country, setCountry] = useState<string>(address?.country ?? '');
    const [cityMunicipality, setCityMunicipality] = useState<string>(address?.cityMunicipality ?? '');
    const [description, setDescription] = useState<string>(address?.description ?? '');
    const [barangay, setBarangay] = useState<string>(address?.barangay ?? '');
    const [province, setProvince] = useState<string>(address?.province ?? '');
    const UpdateAddress = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            console.log('testing to')
            return
        }
        setLoading(true)
        const res = await fetch('/api/addressRoute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rName: rName, country: country, cityMunicipality: cityMunicipality, barangay: barangay, province: province, trademark: description, email: email }),
        })
        const result = await res.json()
        setTimeout(() => {
            setLoading(false)
            console.log('the request is done ', result)
        }, 1000);
    }
    return (
        <div className='w-full bg-black p-10'>
            <div className='pb-2 border-b border-white/30 mb-2 text-2xl'>
                <h1>Address</h1>
            </div>
            <div className='flex '>
                <div className='w-full'>
                    <form onSubmit={UpdateAddress} className='flex flex-col gap-3'>

                        <div className='flex flex-col'>
                            <label htmlFor="">Fullname</label>
                            <Input type="text" value={rName} onChange={(e) => setRName(e.target.value)} />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="">Country</label>
                            <Input list="countries" name="countries" value={country} onChange={(e) => setCountry(e.target.value)} />
                            <datalist id='countries' className='absolute bg-white text-black'>
                                {countries.map((data, index) => (
                                    <option key={index} value={data}>{data}</option>
                                ))}
                            </datalist>
                        </div>
                        <div className='flex gap-1 w-full box-border'>

                            <div className='flex flex-col'>
                                <label htmlFor="">City/Municipality</label>
                                <Input list='city' name='city' value={cityMunicipality} onChange={(e)=>setCityMunicipality(e.target.value)}/>
                                <datalist id='city'>
                                    {luzonPlaces.map((data, index) => (
                                        <option key={index} value={data}>{data}</option>
                                    ))}
                                </datalist>
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor="">Barangay</label>
                                <Input list='barangay' name='barangay' value={barangay} onChange={(e)=>setBarangay(e.target.value)}/>
                                <datalist id='barangay'>
                                    {barangaysJaen.map((data, index) => (
                                        <option key={index} value={data}>{data}</option>
                                    ))}
                                </datalist>
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor="">Province</label>
                                <Input list='province' name='province' value={province} onChange={(e)=>setProvince(e.target.value)}/>
                                <datalist id='province'>
                                    {luzonProvinces.map((data, index) => (
                                        <option key={index} value={data}>{data}</option>
                                    ))}
                                </datalist>
                            </div>

                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="">Trademark</label>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} name="" id="" placeholder='please specify which location. eg. street sign, trademark' />
                        </div>

                        <button
                            type="submit"
                            disabled={loading === true}
                            className="bg-green-400 w-max px-6 py-2 text-center flex justify-center items-center gap-2"
                        >
                            {loading && (
                                <ClipLoader

                                    color='white'
                                    size={20}
                                />
                            )}
                            {loading ? "Saving..." : "Save"}
                        </button>

                    </form>
                </div>

            </div>

        </div>
    )
}

export default AddressCard
