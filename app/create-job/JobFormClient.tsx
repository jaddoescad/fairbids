'use client'
import React, { FormEvent, useEffect, useState } from "react";
import { Input, Select, Button, Box } from "@chakra-ui/react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { saveJobToSupabase } from "@/services/createJobSupabase";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useGoogleMapsScript } from "@/hooks/useGoogleMapsScript";
import { CategorySelectProps, LocationAutocompleteProps, TitleInputProps } from "@/types/types";
import { useToast } from "@chakra-ui/react";


const TitleInput = ({ title, setTitle, error, onEnter }: TitleInputProps) => (
  <>
    <Input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Kitchen remodel: Electrical, plumbing, and drywall"
      height="50px"
      width="100%"
      borderRadius="0px"
      border="1px solid #000"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEnter();
        }
      }}
    />
    {error && (
      <Box color="red" mt="2">
        Please enter a job title.
      </Box>
    )}
  </>
);

const CategorySelect = ({ category, setCategory, error, onEnter }: CategorySelectProps) => (
  <>
    <Select
      placeholder="Select category"
      className="rounded-md px-4 py-2 bg-inherit border"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEnter();
        }
      }}
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


const LocationAutocomplete = ({
  isLoaded,
  error,
  locationValue,
  setLocationValue,
  setLatitude,
  setLongitude,
  isValidLocation,
  setIsValidLocation,
  onSubmit,
}: LocationAutocompleteProps) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const handleBlur = () => {
    onPlaceChanged();
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete?.getPlace();
  
      // Check if the selected place is a city, county, or a more specific location
      const isValidLocation = place?.types?.some((type) =>
        [
          "locality",
          "administrative_area_level_2",
          "administrative_area_level_3",
        ].includes(type)
      );
  
      setIsValidLocation(!!isValidLocation); // Convert to boolean
  
      if (isValidLocation) {
        setLocationValue(place.formatted_address || ""); // Provide default value
  
        // Extract latitude and longitude
        if (place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setLatitude(lat);
          setLongitude(lng);
        }
      } else {
        setLocationValue("");
        setLatitude(null);
        setLongitude(null);
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isValidLocation) {
        onSubmit(e);
      } else {
        setIsValidLocation(false);
      }
    }
  };

  return (
    <>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ["(cities)"],
        }}
      >
        <Input
          placeholder="Type a city"
          value={locationValue}
          onChange={(e) => setLocationValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          
        />
      </Autocomplete>
      {error && !isValidLocation && (
        <Box color="red" mt="2">
          Please enter a valid city.
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
  const [address, setAddress] = useState("");
  const [latitute, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { isLoaded, loadError } = useGoogleMapsScript();
  const [isValidLocation, setIsValidLocation] = useState(false);

  const router = useRouter();

  const handleNext = () => {
    if (step === 1 && title.trim() === "") {
      setTitleError(true);
    } else if (step === 2 && category === "") {
      setCategoryError(true);
    } else if (step === 3 && address.trim() === "") {
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
    setLocationError(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLocationError(false); // Reset locationError state
      if (address.trim() === "" || !isValidLocation) {
        setLocationError(true);
        return;
      }
      setIsLoading(true);

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        console.error("User not logged in");
        setIsLoading(false);
        return;
      }
      const userId = session.user.id;

      if (latitute === null || longitude === null) {
        console.error("Latitude or longitude is missing");
        setIsLoading(false);
        return;
      }

      const savedJob = await saveJobToSupabase(
        supabase,
        title,
        category,
        address,
        latitute,
        longitude,
        userId
      );
      if (savedJob) {
        router.push(`/edit-job/${savedJob.id}`);
      }
    } catch (error) {
      console.error("Error saving job", error);
      toast({
        title: "Error",
        description: "Error saving job",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
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
            <TitleInput
              title={title}
              setTitle={setTitle}
              error={titleError}
              onEnter={handleNext}
            />
            <div className="self-end mt-2">
              <Button onClick={handleNext} colorScheme="blue">
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
              onEnter={handleNext}
            />
            <div className="flex justify-between w-full">
              <Button onClick={handleBack} colorScheme="gray">
                Back
              </Button>
              <Button onClick={handleNext} colorScheme="blue">
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
              locationValue={address}
              setLocationValue={setAddress}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setIsValidLocation={setIsValidLocation}
              isValidLocation={isValidLocation}
              onSubmit={handleSubmit}
            />
            <div className="flex justify-between w-full">
              <Button onClick={handleBack} colorScheme="gray">
                Back
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Creating Job..."
              >
                Create Job
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}