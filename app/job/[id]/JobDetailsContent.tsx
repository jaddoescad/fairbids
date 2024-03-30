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

function JobDetailsContent({ job }) {
  const [updatedJob, setUpdatedJob] = useState(job);

  const handleSaveChanges = async () => {
    try {
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
        <BeforeImages job={job} />
        <AfterImages job={job} />
      </Box>
      <Box background={"white"} padding={10} my={5}>
        <Quotes jobId={job.id} initialQuotes={job.quotes} />
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