"use client";

// JobForm.tsx
import React, { FormEvent, useEffect, useState } from "react";
import { Input, Select, Button, Box } from "@chakra-ui/react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { saveJobToSupabase } from "@/services/createJobSupabase";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const libraries = ["places"];

const TitleInput = ({ title, setTitle, error }) => (
  <>
    <Input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter job title"
      height="50px"
      width="100%"
      borderRadius="0px"
      border="1px solid #000"
    />
    {error && (
      <Box color="red" mt="2">
        Please enter a job title.
      </Box>
    )}
  </>
);

const CategorySelect = ({ category, setCategory, error }) => (
  <>
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
    {error && (
      <Box color="red" mt="2">
        Please select a category.
      </Box>
    )}
  </>
);

const LocationAutocomplete = ({ isLoaded, error, locationValue, setLocationValue }) => {
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autocompleteInstance) => {
    console.log("Autocomplete loaded:", autocompleteInstance);
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    console.log("Place changed");
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      console.log("Place:", place);
      setLocationValue(place.formatted_address);
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  return (
    <>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <Input
          placeholder="Type a city"
          defaultValue={locationValue}
          // value={locationValue}
          // onChange={(e) => setLocationValue(e.target.value)}
        />
      </Autocomplete>
      {error && (
        <Box color="red" mt="2">
          Please enter a location.
        </Box>
      )}
    </>
  );
};

export default function JobForm() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [locationValue, setLocationValue] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBHVjOOTOajAGnWUah3mbCq1NLkGNAZBTs",
    libraries,
  });

  const router = useRouter();

  const handleNext = () => {
    if (step === 1 && title.trim() === "") {
      setTitleError(true);
    } else if (step === 2 && category === "") {
      setCategoryError(true);
    } else if (step === 3 && location.trim() === "") {
      setLocationError(true);
    } else {
      setTitleError(false);
      setCategoryError(false);
      setLocationError(false);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setLocationError(false); // Clear the location error if any
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (location.trim() === "") {
      setLocationError(true);
      return;
    }

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
            <TitleInput title={title} setTitle={setTitle} error={titleError} />
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
            <CategorySelect
              category={category}
              setCategory={setCategory}
              error={categoryError}
            />
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
              isLoaded={isLoaded}
              error={locationError}
              locationValue={locationValue}
              setLocationValue={setLocationValue}
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
