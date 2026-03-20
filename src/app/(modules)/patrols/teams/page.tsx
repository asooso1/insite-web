import { redirect } from "next/navigation";

// /patrols/teams는 /patrols 페이지의 "순찰 팀" 탭에서 관리됩니다.
export default function PatrolTeamsPage() {
  redirect("/patrols");
}
