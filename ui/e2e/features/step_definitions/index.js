import { cucumber } from 'gherkin-jest';
import { stepDefs as navgigation } from './navigation.js';
import { stepDefs as content } from './content.js';

navgigation(cucumber);
content(cucumber);
