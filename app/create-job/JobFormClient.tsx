"use client";

// JobForm.tsx
import React, { FormEvent, useState } from "react";
import { Input, Select, Button, Box } from "@chakra-ui/react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { saveJobToSupabase } from "@/services/createJobSupabase";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const libraries = ["places"];

const TitleInput = ({ title, setTitle }) => (
  <Input
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Enter job title"
    height="50px"
    width="100%"
    borderRadius="0px"
    border="1px solid #000"
  />
);

const CategorySelect = ({ category, setCategory }) => (
  <Select
    placeholder="Select category"
    className="rounded-md px-4 py-2 bg-inherit border"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="kitchen">Kitchen</option>
    <option value="bathroom">Bathroom</option>
    <option value="full-house-renovation">Full House Renovation</option>
    <option value="other">Other</option>
  </Select>
);

const LocationAutocomplete = ({ location, setLocation, isLoaded }) => {

  const handlePlaceChanged = (autocomplete) => {
    const place = autocomplete.getPlace();
    setLocation(place.formatted_address);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Autocomplete onPlaceChanged={(autocomplete) => handlePlaceChanged(autocomplete)}>
    <Input placeholder="Type a city" />
  </Autocomplete>
  );
};

export default function JobForm() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBHVjOOTOajAGnWUah3mbCq1NLkGNAZBTs",
    libraries,
  });

  const router = useRouter();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      console.error("User not logged in");
      return;
    }
    const userId = session.user.id;
    const savedJob = await saveJobToSupabase(
      supabase,
      title,
      category,
      location,
      userId
    );
    if (savedJob) {
      router.push(`/job/${savedJob.id}`);
    }
  };

  return (
    <div className="max-w-4xl w-full mt-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="flex flex-col">
            <Box fontSize="lg" mb="4">
              What are you working on?
            </Box>
            <TitleInput title={title} setTitle={setTitle} />
            <div className="self-end mt-2">
              <Button onClick={handleNext} colorScheme="green">
                Next
              </Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <>
            <Box fontSize="lg" mb="4">
              What type of job is this?
            </Box>
            <CategorySelect category={category} setCategory={setCategory} />
            <div className="flex justify-between w-full">
              <Button onClick={handleBack} colorScheme="gray">
                Back
              </Button>
              <Button onClick={handleNext} colorScheme="green">
                Next
              </Button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <Box fontSize="lg" mb="4">
              Please choose a city?
            </Box>
            <LocationAutocomplete
              location={location}
              setLocation={setLocation}
              isLoaded={isLoaded}
            />
            <div className="flex justify-between w-full">
              <Button onClick={handleBack} colorScheme="gray">
                Back
              </Button>
              <Button type="submit" colorScheme="blue">
                Create Job
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
