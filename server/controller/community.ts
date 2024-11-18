import express, { Request, Response, Router } from 'express';
import CommunityModel from '../models/communities';

const communityController = () => {
  const router: Router = express.Router();

  /**
   * Retrieves a list of tags along with the number of questions associated with each tag.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param _ The HTTP request object (not used in this function).
   * @param res The HTTP response object used to send back the tag count mapping.
   *
   * @returns A Promise that resolves to void.
   */
  /**
   * @param req The Request object containing the tag name in the URL parameters.
   * @param res The HTTP response object used to send back the result of the operation.
   */
  const getCommunityNames = async (req: Request, res: Response): Promise<void> => {
    try {
      const communities = await CommunityModel.find({}); // Retrieve only necessary fields
      res.json(communities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve communities' });
    }
  };

  router.get('/getCommunityNames', getCommunityNames); // so that we can show all tags in the frontend

  return router;
};

export default communityController;
