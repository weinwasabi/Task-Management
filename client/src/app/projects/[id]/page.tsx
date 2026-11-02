import ProjectPage from "./ProjectPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Project({ params }: Props) {
  const { id } = await params;
  return <ProjectPage id={id} />;
}
