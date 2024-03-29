"use server";
import { CategorySelect } from "@/components/CreateJobComponents/CategorySelect";
import { LocationAutocomplete } from "@/components/CreateJobComponents/LocationInput";
import { TitleInput } from "@/components/CreateJobComponents/TitleInput";
import {
  AfterImages,
  BeforeImages,
} from "@/components/CreateJobComponents/BeforeAfterImageUpload";
import { DescriptionInput } from "@/components/CreateJobComponents/Description";
import { Quotes } from "@/components/CreateJobComponents/Quotes";
import { Box, Text, Center } from "@chakra-ui/react";
import { fetchJobData } from "@/services/fetchJobData";

function JobDetailsContent({ job }) {

  return (
    <Box marginTop={10} paddingBottom={"200px"}>
      <Center>
        <Text fontSize="3xl" fontWeight="bold" color="black" marginBottom={5}>
          Post Your Job
        </Text>
      </Center>
      <Box background={"white"} padding={10}>
        <TitleInput initialTitle={job.title} jobId={job.id} />
        <CategorySelect initialCategory={job.category} jobId={job.id} />
        <LocationAutocomplete initialLocation={job.location} jobId={job.id} />
        <DescriptionInput initialDescription={job.description} jobId={job.id} />
      </Box>
      <Box background={"white"} padding={10} my={5}>
        <BeforeImages job={job} />
        <AfterImages  job={job} />
      </Box>
      <Box background={"white"} padding={10} my={5}>
        <Quotes jobId={job.id} initialQuotes={job.quotes} />
      </Box>
    </Box>
  );
}

export default async function JobDetails({ params }) {
  const job = await fetchJobData(params.id);

  if (!job) {
    return <div>Loading...</div>;
  }

  return <JobDetailsContent job={job} />;
}