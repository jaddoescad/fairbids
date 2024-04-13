'use client'

import { CategorySelect } from "@/components/CreateJobComponents/CategorySelect";
import { LocationAutocomplete } from "@/components/CreateJobComponents/LocationInput";
import { TitleInput } from "@/components/CreateJobComponents/TitleInput";
import { AfterImages, BeforeImages } from "@/components/CreateJobComponents/BeforeAfterImageUpload";
import { DescriptionInput } from "@/components/CreateJobComponents/Description";
import { Quotes } from "@/components/CreateJobComponents/Quotes";
import { Box, Text, Center, Button } from "@chakra-ui/react";
import { fetchJobData } from "@/services/fetchJobData";
import { useEffect, useState } from "react";
import { updateJobDetails } from "@/services/updateJobDetails";
import { deleteImages, uploadImages } from "@/services/uploadImage";
import { createClient } from "@/utils/supabase/client";
import { deleteQuotes, uploadQuotes } from "@/services/uploadQuoteFile";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import { revalidateJobPathServer } from "@/services/revalidatePath";
import { isValidLocation } from "@/services/isValidLocation";

function JobDetailsContent({ job }) {
  const [updatedJob, setUpdatedJob] = useState(job);
  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);
  const [quotes, setQuotes] = useState(job.quotes || []);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [quotesToDelete, setQuotesToDelete] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [quoteError, setQuoteError] = useState("");
  const [imageError, setImageError] = useState("");
  const [isLocationValid, setIsLocationValid] = useState(true);

  const toast = useToast();
  const router = useRouter();

  const handleSaveChanges = async () => {
    try {
      setTitleError("");
      setCategoryError("");
      setDescriptionError("");
      setLocationError("");
      setImageError("");
      setQuoteError("");

      if (!updatedJob?.location || !isLocationValid) {
        setLocationError("Please select a valid location from the list.");
        setIsSaving(false);
        toast({
          title: "Error",
          description: "Please select a valid location from the list.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!updatedJob?.location || Object.keys(updatedJob.location).length === 0) {
        setLocationError("Please select a valid location from the list.");
        setIsSaving(false);
        toast({
          title: "Error",
          description: "Please select a valid location from the list.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Validate the location
      const isValid = await isValidLocation(updatedJob.location);
      if (!isValid) {
        setLocationError("Invalid location. Please select a valid location.");
        setIsSaving(false);
        toast({
          title: "Error",
          description: "Invalid location. Please select a valid location.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!updatedJob?.category) {
        setCategoryError("Category is required.");
        setIsSaving(false);
        toast({
          title: "Error",
          description: "Category is required.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (updatedJob.description == null || !updatedJob?.description.trim()) {
        setDescriptionError("Description is required.");
        setIsSaving(false);
        toast({
          title: "Error",
          description: "Description is required.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (quotes.length === 0) {
        setQuoteError("At least one quote is required.");
        setIsSaving(false);
        toast({
          title: "Error",
          description: "At least one quote is required.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      //check if there is at least one before or one after image (including existing images)
      if (beforeImages.length === 0 && job?.job_files.length === 0) {
        setImageError("At least one before image is required.");
        setIsSaving(false);
        toast({
          title: "Error",
          description: "At least one before image is required.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (afterImages.length === 0 && job.job_files.length === 0) {
        setImageError("At least one after image is required.");
        setIsSaving(false);
        toast({
          title: "Error",
          description: "At least one after image is required.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setIsSaving(true);

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        console.error("User not logged in");
        return;
      }

      const userId = session.user.id;
      const newBeforeImages = beforeImages.filter((image) => !image.filePath);
      const newAfterImages = afterImages.filter((image) => !image.filePath);

      await Promise.all([
        uploadImages(newBeforeImages, userId, job.id, "before"),
        uploadImages(newAfterImages, userId, job.id, "after"),
        deleteImages(imagesToDelete, job.id),
        deleteQuotes(supabase, quotesToDelete),
      ]);

      // Filter out the quotes that already have an id (existing quotes)
      const localQuotes = quotes.filter((quote) => !quote.id);

      // Upload only the local quotes
      await uploadQuotes(localQuotes, job.id);
      await updateJobDetails(updatedJob);

      await revalidateJobPathServer(job.id);
      router.push(`/job/${job.id}`);

      // Refresh the page or show a success message
    } catch (error) {
      console.error("Error updating job details", error);
      toast({
        title: "Error",
        description: error.toString(),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      // Show an error message
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box marginTop={10} paddingBottom={"200px"}>
      <Center>
        <Text fontSize="3xl" fontWeight="bold" color="black" marginBottom={5}>
          Post Your Job
        </Text>
      </Center>
      <Box background={"white"} padding={10}>
        <TitleInput
          initialTitle={updatedJob.title}
          setTitle={(title) => setUpdatedJob({ ...updatedJob, title })}
          errorMessage={titleError}
        />
        <CategorySelect
          initialCategory={updatedJob.category}
          setCategory={(category) => setUpdatedJob({ ...updatedJob, category })}
          errorMessage={categoryError}
        />
        <LocationAutocomplete
          initialLocation={updatedJob.location}
          setLocation={(location) => setUpdatedJob({ ...updatedJob, location })}
          errorMessage={locationError}
        />
        <DescriptionInput
          initialDescription={updatedJob.description}
          setDescription={(description) =>
            setUpdatedJob({ ...updatedJob, description })
          }
          errorMessage={descriptionError}
        />
      </Box>
      <Box background={"white"} padding={10} my={5}>
        <BeforeImages
          job={job}
          onBeforeImagesChange={setBeforeImages}
          setImagesToDelete={setImagesToDelete}
        />
        <AfterImages
          job={job}
          onAfterImagesChange={setAfterImages}
          setImagesToDelete={setImagesToDelete}
          errorMessage={imageError}
        />
      </Box>
      <Box background={"white"} padding={10} my={5}>
        <Quotes
          jobId={job.id}
          initialQuotes={job.quotes}
          setQuotes={setQuotes}
          setQuotesToDelete={setQuotesToDelete}
          errorMessage={quoteError}
        />
      </Box>
      <Button
        colorScheme="blue"
        size="lg"
        width="100%"
        marginBottom={5}
        isLoading={isSaving}
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>
    </Box>
  );
}

export default function JobDetails({ jobId }) {
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (jobId) {
        const jobData = await fetchJobData(jobId);
        setJob(jobData);
      }
    };
    fetchData();
  }, [jobId]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return <JobDetailsContent job={job} />;
}