import { describe, it, expect, vi } from 'vitest';

import { asyncExec } from '@/utils/os';
import { getTicketIdFromBranchName, shouldValidateTicketId } from '@/utils/git-info';
import { TICKET_ID_REGEX } from '@/constants/ticket-id';

vi.mock('@/utils/os');

describe('[utils/git-info]', () => {
	describe('getTicketIdFromBranchName()', () => {
		it('should return null when "getBranchName" throws', async () => {
			vi.mocked(asyncExec).mockRejectedValueOnce(undefined);

			const result = await getTicketIdFromBranchName(/^JUST A TEST$/);

			expect(result).toBeNull();
		});

		it('should return null when "getBranchName" returns with a defined "stderr"', async () => {
			vi.mocked(asyncExec).mockResolvedValueOnce({ stdout: '', stderr: 'DUMMY_ERROR' });

			const result = await getTicketIdFromBranchName(/^JUST A TEST$/);

			expect(result).toBeNull();
		});

		it('should return null when failed to match ticket Id', async () => {
			vi.mocked(asyncExec).mockResolvedValueOnce({ stdout: 'TEST A JUST', stderr: '' });

			const result = await getTicketIdFromBranchName(/^JUST A TEST$/);

			expect(result === null).toEqual(true);
		});

		it('should ticket Id when there is one', async () => {
			const ticketId = 'CLO-12345';
			const ticketIdRegex = new RegExp(TICKET_ID_REGEX);

			vi.mocked(asyncExec).mockResolvedValueOnce({ stdout: `[${ticketId}] JUST A TEST`, stderr: '' });

			const result = await getTicketIdFromBranchName(ticketIdRegex);

			expect(result === ticketId).toEqual(true);
		});
	});

	describe('shouldValidateTicketId()', () => {
		it('should return "false" when "getBranchName" throws', async () => {
			vi.mocked(asyncExec).mockRejectedValueOnce(undefined);

			const result = await shouldValidateTicketId(['JUST A TEST']);

			expect(result).toEqual(false);
		});

		it('should return "false" when "getBranchName" returns with a defined "stderr"', async () => {
			vi.mocked(asyncExec).mockResolvedValueOnce({ stdout: '', stderr: 'DUMMY_ERROR' });

			const result = await shouldValidateTicketId(['JUST A TEST']);

			expect(result).toEqual(false);
		});

		it('should return "true" when "getBranchName" returns a string contained in the ignored branchrs', async () => {
			vi.mocked(asyncExec).mockResolvedValueOnce({ stdout: 'TEST', stderr: '' });

			const result = await shouldValidateTicketId(['TEST']);

			expect(result).toEqual(false);
		});

		it('should return "true" when "getBranchName" returns a string which is not contained in the ignored branchrs', async () => {
			vi.mocked(asyncExec).mockResolvedValueOnce({ stdout: 'TEST', stderr: '' });

			const result = await shouldValidateTicketId(['DUMMY_TEXT']);

			expect(result).toEqual(true);
		});
	});
});
