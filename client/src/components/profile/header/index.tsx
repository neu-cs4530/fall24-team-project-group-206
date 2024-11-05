/**
 * Interface representing the props for the ProfileHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 */
interface ProfileHeaderProps {
  titleText: string;
}

/**
 * ProfileHeader component displays the header section.
 * It includes the title
 *
 * @param titleText - The title text to display in the header.
 */
const ProfileHeader = ({ titleText }: ProfileHeaderProps) => (
  <div>
    <div className='space_between right_padding'>
      <div className='bold_title'>{titleText}</div>
    </div>
  </div>
);

export default ProfileHeader;
