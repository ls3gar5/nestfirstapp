import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { Queue } from 'bullmq';

let taskService: TaskService;
let taskRepository: jest.Mocked<TaskRepository>;
let eventEmitter: jest.Mocked<EventEmitter2>;
let cacheManager: jest.Mocked<Cache>;
let audioQueue: jest.Mocked<Queue>;

beforeEach(() => {
    jest.resetModules();
    jest.mock('../task/utils/task.util', () => ({
        provinceCodeDescription: {
            ciudaddebuenosaires: 'Ciudad de Buenos Aires'
        }
    }));

    taskRepository = {
        getMessage: jest.fn(),
        // other methods can be mocked as needed
    } as unknown as jest.Mocked<TaskRepository>;

    eventEmitter = {
        emit: jest.fn(),
        cacheManager = {
            get: jest.fn(),
            set: jest.fn(),
        } as unknown as jest.Mocked<Cache>;

        audioQueue = {
            add: jest.fn(),
            process: jest.fn(),
        } as unknown as jest.Mocked<Queue>;

        taskService = new TaskService(
            taskRepository,
            eventEmitter,
            cacheManager,
            audioQueue,
        );
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

it('should compute, return from cache Ciudad de Buenos Aires', async () => {

    cacheManager.get.mockResolvedValueOnce('Ciudad de Buenos Aires');
    taskRepository.getMessage.mockReturnValueOnce('Ciudad de Buenos Aires');
    const result = await taskService.getMessage();

    expect(cacheManager.get).toHaveBeenCalledWith('province');
    expect(result).toBe('Ciudad de Buenos Aires');
    expect(cacheManager.set).not.toHaveBeenCalled();
    expect(eventEmitter.emit).not.toHaveBeenCalled();
});

it('should return from array Ciudad de Buenos Aires', async () => {

    cacheManager.get.mockResolvedValueOnce(undefined);
    taskRepository.getMessage.mockReturnValueOnce('Ciudad de Buenos Aires');
    const result = await taskService.getMessage();

    expect(cacheManager.get).toHaveBeenCalledWith('province');
    expect(result).toBe('Ciudad de Buenos Aires');
});

it('should compute, cache, emit event, and return repository message if no cache', async () => {
    cacheManager.get.mockResolvedValueOnce(null);
    taskRepository.getMessage.mockReturnValueOnce('Ciudad de Buenos Aires');
    const result = await taskService.getMessage();

    expect(cacheManager.get).toHaveBeenCalledWith('province');
    expect(cacheManager.set).toHaveBeenCalledWith('province', 'Ciudad de Buenos Aires');
    expect(eventEmitter.emit).toHaveBeenCalledWith('task.created', 'New Task Created');
    expect(result).toBe('Ciudad de Buenos Aires');
});

it('should use fallback code if provinceCodeDescription does not contain the key - No Province Code', async () => {
    // const { TaskService } = require('./task.service');
    jest.mock('../task/utils/task.util', () => ({
        provinceCodeDescription: {}
    }));

    cacheManager.get.mockResolvedValueOnce(undefined);
    taskRepository.getMessage.mockReturnValueOnce('Ciudad de Buenos Aires');
    const result = await taskService.getMessage();

    expect(cacheManager.set).toHaveBeenCalledWith('province', 'Ciudad de Buenos Aires');
    expect(result).toBe('Ciudad de Buenos Aires');
});
});