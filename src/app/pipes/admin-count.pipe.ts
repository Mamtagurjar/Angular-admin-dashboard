// import { Pipe, PipeTransform } from '@angular/core';
// import { User } from '../models/user.model';

// @Pipe({ name: 'adminCount', standalone: true })
// export class AdminCountPipe implements PipeTransform {
//   transform(users: User[]): number {
//     return users?.filter(u => u.role?.toLowerCase() === 'admin').length ?? 0;
//   }
// }


import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({ name: 'adminCount', standalone: true })
export class AdminCountPipe implements PipeTransform {
  // New API has no role field — just return total user count as placeholder
  transform(users: User[]): number {
    return users?.length ?? 0;
  }
}