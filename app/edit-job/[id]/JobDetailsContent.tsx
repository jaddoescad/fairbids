'use client'

import { CategorySelect } from "@/components/CreateJobComponents/CategorySelect";
import { LocationAutocomplete } from "@/components/CreateJobComponents/LocationInput";
import { TitleInput } from "@/components/CreateJobComponents/TitleInput";
import { AfterImages, BeforeImages } from "@/components/CreateJobComponents/BeforeAfterImageUpload";
import { DescriptionInput } from "@/components/CreateJobComponents/Description";
import { Quotes } from "@/components/CreateJobComponents/Quotes";
import { Box, Text, Center, Button, Flex, Spinner } from "@chakra-ui/react";
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
import { Job, ImageType, Quote, Location, JobDetails } from "@/types/types";

function JobDetailsContent({ job }: { job: Job }) {
  const [updatedJob, setUpdatedJob] = useState(job);
  const [beforeImages, setBeforeImages] = useState<ImageType[]>([]);
  const [afterImages, setAfterImages] = useState<ImageType[]>([]);
  const [quotes, setQuotes] = useState(job.quotes || []);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [quotesToDelete, setQuotesToDelete] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [quoteError, setQuoteError] = useState("");
  const [imageError, setImageError] = useState("");

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

      if (
        !updatedJob?.address ||
        !updatedJob?.latitude ||
        !updatedJob?.longitude
      ) {
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
      const isValid = await isValidLocation(updatedJob.address);
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
      const localQuotes = quotes.filter((quote: Quote) => !quote.id);

      // Upload only the local quotes
      await uploadQuotes(localQuotes, job.id);

      const updatedJobDetails: JobDetails = {
        id: updatedJob.id,
        title: updatedJob.title,
        category: updatedJob.category,
        location: {
          address: updatedJob.address,
          latitude: updatedJob.latitude,
          longitude: updatedJob.longitude,
        },
        description: updatedJob.description,
        published: true,
      };

      await updateJobDetails(updatedJobDetails);

      await revalidateJobPathServer(job.id);
      router.push(`/job/${job.id}`);

      // Refresh the page or show a success message
    } catch (error) {
      console.error("Error updating job details", error);
      toast({
        title: "Error",
        description: "Error updating job details",
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
          setTitle={(title: string) => setUpdatedJob({ ...updatedJob, title })}
          errorMessage={titleError}
        />
        <CategorySelect
          initialCategory={updatedJob.category}
          setCategory={(category: string) => setUpdatedJob({ ...updatedJob, category })}
          errorMessage={categoryError}
        />
        <LocationAutocomplete
          initialLocation={updatedJob.address}
          setLocation={(newLocation: Location) =>
            setUpdatedJob({
              ...updatedJob,
              address: newLocation.address,
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
            })
          }
          errorMessage={locationError}
        />
        <DescriptionInput
          initialDescription={updatedJob.description}
          setDescription={(description: string) =>
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

export default function JobDetails({ jobId }: { jobId: string }) {
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
    return (
      <Flex align="center" justify="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return <JobDetailsContent job={job} />;
}