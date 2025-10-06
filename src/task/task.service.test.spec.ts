import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { provinceCodeDescription } from 'src/utils/task.util';

jest.mock('src/utils/task.util', () => ({
    provinceCodeDescription: {
        ciudadebuenosaires: 'CABA-CODE'
    }
}));

describe('TaskService - getMessage', () => {
    let taskService: TaskService;
    let taskRepository: jest.Mocked<TaskRepository>;
    let eventEmitter: jest.Mocked<EventEmitter2>;
    let cacheManager: jest.Mocked<Cache>;

    beforeEach(() => {
        taskRepository = {
            getMessage: jest.fn().mockResolvedValue('Repository Message'),
            // other methods can be mocked as needed
        } as unknown as jest.Mocked<TaskRepository>;

        eventEmitter = {
            emit: jest.fn(),
        } as unknown as jest.Mocked<EventEmitter2>;

        cacheManager = {
            get: jest.fn(),
            set: jest.fn(),
        } as unknown as jest.Mocked<Cache>;

        taskService = new TaskService(
            taskRepository,
            eventEmitter,
            cacheManager,
        );
    });

    it('should return cached province value if present', async () => {
        cacheManager.get.mockResolvedValueOnce('CACHED_CODE');
        const result = await taskService.getMessage();
        expect(cacheManager.get).toHaveBeenCalledWith('province');
        expect(result).toBe('CACHED_CODE');
        expect(cacheManager.set).not.toHaveBeenCalled();
        expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('should compute, cache, emit event, and return repository message if no cache', async () => {
        cacheManager.get.mockResolvedValueOnce(undefined);
        taskRepository.getMessage.mockReturnValueOnce('Repository Message');
        const result = await taskService.getMessage();

        expect(cacheManager.get).toHaveBeenCalledWith('province');
        expect(cacheManager.set).toHaveBeenCalledWith('province', 'CABA-CODE');
        expect(eventEmitter.emit).toHaveBeenCalledWith('task.created', 'New Task Created');
        expect(result).toBe('Repository Message');
    });

    it('should use fallback code if provinceCodeDescription does not contain the key', async () => {
        // Remove the key to simulate fallback
        // provinceCodeDescription.ciudaddebuenosaires = undefined;
        cacheManager.get.mockResolvedValueOnce(undefined);
        taskRepository.getMessage.mockReturnValueOnce('Repository Message');
        const result = await taskService.getMessage();

        expect(cacheManager.set).toHaveBeenCalledWith('province', 'PEPEEEEE');
        expect(result).toBe('Repository Message');
    });
});