//	IN CASE CONSOLE LOGS FAILURE TO PLACE SHIP RUN SCRIPT AGAIN

#include <iostream>
#include <time.h>
#include <fstream>

using namespace std;

const int n = 11;
const int no_ship = 0;
int users[8] = {1, 2, 3, 4, 5, 6, 7, 8};
int grid[n][n];

bool valid2(int x, int y)
{
	if (grid[x][y] != no_ship)
		return false;

	else if (grid[x][y-1] != no_ship || y-1 < 0)
		return false;

	else if (grid[x+1][y] != no_ship || x+1 >= n)
		return false;

	else if (grid[x][y+1] != no_ship || y+1 >= n)
		return false;

	else if (grid[x-1][y] != no_ship || x-1 < 0)
		return false;

	else
		return true;
}

bool valid(int x, int y)
{
	if (grid[x][y] != no_ship || x < 0 || x >= n || y < 0 || y >= n)
		return false;

	return true;
}

int main()
{
	srand(time(NULL));

	for (int i = 0;  i < n; i++)
		for (int j = 0; j < n; j++)
			grid[i][j] = no_ship;

	int no_2 = 1, no_3 = 1;

	// place 3 unit ships
	for (int i = 0; i < no_3; i++)
	{
		// user no
		for (int j = 1; j <= 8; j++)
		{
			int x = rand() % n;
			int y = rand() % n;

			int straight = rand() % 2;

			if (straight)
			{
				int horizontal = rand() % 2;

				if (horizontal && valid(x-1, y) && valid(x+1, y) && valid(x, y))
					grid[x-1][y] = grid[x][y] = grid[x+1][y] = j;

				else if (valid(x, y-1) && valid(x, y+1) && valid(x, y))
					grid[x][y-1] = grid[x][y] = grid[x][y+1] = j;

				else
					straight = 0;
			}

			if (!straight)
			{
				if (valid(x, y-1) && valid(x+1, y) && valid(x, y))	// down-left
					grid[x][y-1] = grid[x][y] = grid[x+1][y] = j;

				else if (valid(x, y+1) && valid(x+1, y) && valid(x, y)) // down-right
					grid[x][y+1] = grid[x][y] = grid[x+1][y] = j;

				else if (valid(x, y+1) && valid(x-1, y) && valid(x, y)) // up-right
					grid[x][y+1] = grid[x][y] = grid[x-1][y] = j;

				else if (valid(x, y-1) && valid(x-1, y) && valid(x, y)) // up-left
					grid[x][y-1] = grid[x][y] = grid[x-1][y] = j;

				else
					cout << "FAILED TO PLACE 3 UNIT SHIP\n";
			}

			cout << "(" << x << ", " << y << ")\n";
		}
	}

	cout << "\n\nALL UNIT 3 SHIPS PLACED\n\n";

	// place 2 unit ships
	for (int i = 0; i < no_2; i++)
	{
		for (int j = 1; j <= 8; j++)
		{
			int x = rand() % n;
			int y = rand() % n;

			while (!valid2(x, y))
			{
				x = rand() % n;
				y = rand() % n;
			}

			int direction = rand() % 4;

			if (direction == 0)	// left
				grid[x][y-1] = grid[x][y] = j;

			else if (direction == 1) // down
				grid[x][y] = grid[x+1][y] = j;

			else if (direction == 2) // right
				grid[x][y+1] = grid[x][y] = j;

			else // up
				grid[x][y] = grid[x-1][y] = j;

			cout << "(" << x << ", " << y << ")\n";
		}
	}

	cout << "\n\nALL 2 UNIT SHIPS PLACED\n\n";

	for (int i = 0; i < n; i++)
	{
		for (int j = 0; j < n; j++)
			cout << grid[i][j] << "  ";
		cout << "\n";
	}

	ofstream fo("grid.txt");
	for (int i = 0; i < n; i++)
	{
		for (int j = 0; j < n; j++)
			fo << grid[i][j];
		fo << "\n";
	}

	fo.close();

	return 0;
}