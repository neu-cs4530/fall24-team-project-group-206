import QuestionPage from '../../questionPage';
import './index.css';

/**
 * DefaultHomePage component renders a page displaying questions from the QuestionPage component
 * with a title indicating that no community is selected.
 */
const DefaultHomePage = () => (
  <div className='home-page-container'>
    <h2 className='home-page-title'>No Community Selected</h2>
    <hr />
    <QuestionPage />
  </div>
);

export default DefaultHomePage;
