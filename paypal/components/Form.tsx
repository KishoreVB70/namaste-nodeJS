// Single responsibility component -> Get user input on Library and create it
// Can further breakdown into two -> Input component + Add library component

// React imports
import React, { ReactNode } from 'react';
// Form
import {SubmitHandler, useForm} from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

// Components
// Local imports
import { LibraryFormData, librarySchema } from '@/lib/schema';
const Label = ({children}: {children: ReactNode}) => {
  return (
    <label
      className="block text-white-a700 font-poppins mb-1 self-end !font-actor sm:self-auto text-[16px] font-semibold not-italic"
    >
    {children}
  </label>
  )
}

const Form = () => {
  // Hooks
  const { 
    register, handleSubmit, 
    formState: {errors, isSubmitting},
    reset, setError
  } = useForm<LibraryFormData>({
    resolver: zodResolver(librarySchema)
  });
  

  const createLibrary = async(name: string, description: string, thumbnail: File) => {
    // Check if library name unique
    const isUniqueResult = await isLibraryUniqueService(userActor,principal, name );
    if (!isUniqueResult.value) {
        setError("name", {
            message: "Library name not unique"
        })
        return;
    }
    reset();
  }

  const submitFunction: SubmitHandler<LibraryFormData> = async (data) => {
    createLibrary(data.name, data.description, data.thumbnail[0]);
  }

  if (isSubmitting) {
    return (
        <h1 className='text-9xl font-bold'>Loading Man of State</h1>
    )
  }

  return (
    <form
        onSubmit={handleSubmit(submitFunction)}
        autoComplete="off"
        className="shadow-md rounded px-2 md:px-8 pt-6 pb-8 mb-4"
    >
        <div className="mb-4">
            <Label> Library Name </Label>
            <input
                {...register("name")}
                type="text"
                placeholder="Rock music"
                className=" !bg-white !text-black p-2  h-[40px] !px-4 !rounded-md font-medium"
            />
            {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div className="mb-4">
            <Label> Description </Label>
            <input
                {...register("description")}
                type='text'
                placeholder="Quality rock"
                className=" !bg-white !text-black p-2  h-[40px] !px-4 !rounded-md font-medium"
                required
            />
            {errors.description && <p>{errors.description.message}</p>}
        </div>
        <div className="mb-4">
            <Label>Upload Thumbnail</Label>
            <input
                {...register("thumbnail")}
                type="file"
                accept="image/*"
                className=" !bg-white !text-black p-2  h-[40px] !px-4 !rounded-md font-medium"
                required
            />
            {errors.thumbnail && <p>{errors.thumbnail.message}</p>}
        </div>
        <button
            type="submit"
            className="w-full mt-5 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Add Library
        </button>
    </form>
  );
};

export default Form;