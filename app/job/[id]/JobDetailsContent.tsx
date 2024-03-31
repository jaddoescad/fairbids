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
import { uploadImages } from "@/services/uploadImage";
import { createClient } from "@/utils/supabase/client";
import { uploadQuotes } from "@/services/uploadQuoteFile";

function JobDetailsContent({ job }) {
  const [updatedJob, setUpdatedJob] = useState(job);
  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);
  const [quotes, setQuotes] = useState(job.quotes || []);

  const handleSaveChanges = async () => {
    try {
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
      ]);

      // Filter out the quotes that already have an id (existing quotes)
      const localQuotes = quotes.filter((quote) => !quote.id);

      // Upload only the local quotes
      await uploadQuotes(localQuotes, job.id);
      await updateJobDetails(updatedJob);

      // Refresh the page or show a success message
    } catch (error) {
      console.error("Error updating job details", error);
      // Show an error message
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
        />
        <CategorySelect
          initialCategory={updatedJob.category}
          setCategory={(category) => setUpdatedJob({ ...updatedJob, category })}
        />
        <LocationAutocomplete
          initialLocation={updatedJob.location}
          setLocation={(location) => setUpdatedJob({ ...updatedJob, location })}
        />
        <DescriptionInput
          initialDescription={updatedJob.description}
          setDescription={(description) =>
            setUpdatedJob({ ...updatedJob, description })
          }
        />
      </Box>
      <Box background={"white"} padding={10} my={5}>
        <BeforeImages job={job} onBeforeImagesChange={setBeforeImages} />
        <AfterImages job={job} onAfterImagesChange={setAfterImages} />
      </Box>
      <Box background={"white"} padding={10} my={5}>
        <Quotes
          jobId={job.id}
          initialQuotes={job.quotes}
          setQuotes={setQuotes}
        />
      </Box>
      <Button
        colorScheme="blue"
        size="lg"
        width="100%"
        marginBottom={5}
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