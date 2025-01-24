"use client";

import React, { ReactNode } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LibraryFormData, librarySchema } from '@/lib/schema';

// Label component for form fields
const Label = ({ children }: { children: ReactNode }) => (
  <label className="block text-white-a700 font-poppins mb-1 self-end !font-actor sm:self-auto text-[16px] font-semibold not-italic">
    {children}
  </label>
);

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
    reset
  } = useForm<LibraryFormData>({
    resolver: zodResolver(librarySchema),
  });

  const createLibrary = async (data: LibraryFormData) => {
    // Check if library name is unique
    const isUniqueResult = false;
    if (!isUniqueResult) {
      console.log("Hien")
      setError('name', {
        message: 'Library name not unique',
      });
      return;
    }
    console.log("success", data);
    reset();
  };

  const submitFunction: SubmitHandler<LibraryFormData> = async (data) => {
    await createLibrary(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitFunction)}
      autoComplete="off"
      className="shadow-md rounded px-2 md:px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <Label>Library Name</Label>
        <input
          {...register('name')}
          type="text"
          placeholder="Rock music"
          className="!bg-white !text-black p-2 h-[40px] !px-4 !rounded-md font-medium"
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div className="mb-4">
        <Label>Description</Label>
        <input
          {...register('description')}
          type="text"
          placeholder="Quality rock"
          className="!bg-white !text-black p-2 h-[40px] !px-4 !rounded-md font-medium"
        />
        {errors.description && <p>{errors.description.message}</p>}
      </div>
      <div className="mb-4">
        <Label>Upload Thumbnail</Label>
        <Controller
          name="thumbnail"
          control={control}
          render={({ field }) => (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => field.onChange(e.target.files)}
              className="!bg-white !text-black p-2 h-[40px] !px-4 !rounded-md font-medium"
            />
          )}
        />
        {errors.thumbnail && <p>{String(errors.thumbnail.message)}</p>}
      </div>
      <button
        type="submit"
        className="w-full mt-5 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Add Library'}
      </button>
    </form>
  );
};

export default Form;
